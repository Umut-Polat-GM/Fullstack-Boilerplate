#!/usr/bin/env node
/**
 * Full-stack module generator.
 *
 *   npm run generate <name> [-- --plural <plural>] [--backend-only | --frontend-only]
 *
 *   npm run generate task
 *     → backend/src/modules/task/            (model · validation · controller · routes · index)
 *     → frontend/src/features/tasks/         (index · api · queries · page)
 *     → REST API at /api/tasks, page at /tasks, nav link — all auto-registered.
 *
 * The generated module has `title` + `description` fields: edit the model,
 * the validation schema and the page to fit your domain.
 */
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    plural: { type: "string" },
    "backend-only": { type: "boolean", default: false },
    "frontend-only": { type: "boolean", default: false },
  },
});

const name = positionals[0]?.toLowerCase();
if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error(
    "Usage: npm run generate <name>   (lowercase letters, digits and dashes, e.g. task, blog-post)",
  );
  process.exit(1);
}

// ── Naming helpers ────────────────────────────────────────────────
const plural =
  values.plural ??
  (/(s|x|z|ch|sh)$/.test(name)
    ? `${name}es`
    : /[^aeiou]y$/.test(name)
      ? `${name.slice(0, -1)}ies`
      : `${name}s`);
const pascal = (s) => s.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
const camel = (s) => pascal(s).replace(/^./, (c) => c.toLowerCase());
const n = {
  name, //               blog-post
  plural, //             blog-posts
  Pascal: pascal(name), // BlogPost
  Plural: pascal(plural), // BlogPosts
  camelPlural: camel(plural), // blogPosts
  table: plural.replaceAll("-", "_"), // blog_posts
  label: pascal(plural).replace(/([a-z])([A-Z])/g, "$1 $2"), // Blog Posts
  singularLabel: pascal(name)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase(), // blog post
};

// ── Backend templates ─────────────────────────────────────────────
const backend = {
  [`${n.name}.model.js`]: `import { sql } from "#db/index.js";

/** MODEL — data access for the "${n.table}" table. */
export const ${n.Pascal}Model = {
  /** Idempotent schema setup, runs once at startup. */
  async migrate() {
    await sql\`
      CREATE TABLE IF NOT EXISTS ${n.table} (
        id          SERIAL PRIMARY KEY,
        title       VARCHAR(255) NOT NULL,
        description TEXT,
        created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      )
    \`;
  },

  findAll() {
    return sql\`SELECT * FROM ${n.table} ORDER BY created_at DESC\`;
  },

  async findById(id) {
    const [row] = await sql\`SELECT * FROM ${n.table} WHERE id = \${id}\`;
    return row ?? null;
  },

  async create({ title, description = null }) {
    const [row] = await sql\`
      INSERT INTO ${n.table} (title, description)
      VALUES (\${title}, \${description})
      RETURNING *
    \`;
    return row;
  },

  async update(id, { title, description = null }) {
    const [row] = await sql\`
      UPDATE ${n.table}
      SET title = \${title}, description = \${description}, updated_at = NOW()
      WHERE id = \${id}
      RETURNING *
    \`;
    return row ?? null;
  },

  async remove(id) {
    const [row] = await sql\`DELETE FROM ${n.table} WHERE id = \${id} RETURNING *\`;
    return row ?? null;
  },
};
`,

  [`${n.name}.validation.js`]: `import { z } from "zod";

export const ${n.camelPlural}BodySchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  description: z.string().trim().max(5000).optional(),
});
`,

  [`${n.name}.controller.js`]: `import { ApiError } from "#utils/ApiError.js";
import { created, ok } from "#utils/response.js";
import { ${n.Pascal}Model } from "./${n.name}.model.js";

/** CONTROLLER — HTTP ↔ model. Thrown errors reach the global error handler. */

export async function list(_req, res) {
  ok(res, await ${n.Pascal}Model.findAll());
}

export async function getById(req, res) {
  const item = await ${n.Pascal}Model.findById(req.validated.params.id);
  if (!item) throw ApiError.notFound("${n.Pascal} not found");
  ok(res, item);
}

export async function create(req, res) {
  created(res, await ${n.Pascal}Model.create(req.validated.body), "${n.Pascal} created");
}

export async function update(req, res) {
  const item = await ${n.Pascal}Model.update(req.validated.params.id, req.validated.body);
  if (!item) throw ApiError.notFound("${n.Pascal} not found");
  ok(res, item, "${n.Pascal} updated");
}

export async function remove(req, res) {
  const item = await ${n.Pascal}Model.remove(req.validated.params.id);
  if (!item) throw ApiError.notFound("${n.Pascal} not found");
  ok(res, item, "${n.Pascal} deleted");
}
`,

  [`${n.name}.routes.js`]: `import { Router } from "express";
import { idParamSchema, validate } from "#middlewares/validate.js";
import * as controller from "./${n.name}.controller.js";
import { ${n.camelPlural}BodySchema } from "./${n.name}.validation.js";

const router = Router();

router
  .route("/")
  .get(controller.list)
  .post(validate({ body: ${n.camelPlural}BodySchema }), controller.create);

router
  .route("/:id")
  .get(validate({ params: idParamSchema }), controller.getById)
  .put(validate({ params: idParamSchema, body: ${n.camelPlural}BodySchema }), controller.update)
  .delete(validate({ params: idParamSchema }), controller.remove);

export default router;
`,

  "index.js": `import { ${n.Pascal}Model } from "./${n.name}.model.js";
import router from "./${n.name}.routes.js";

/** Module manifest — auto-mounted at /api${"/" + n.plural} by src/modules/index.js */
export default {
  name: "${n.name}",
  basePath: "/${n.plural}",
  router,
  migrate: ${n.Pascal}Model.migrate,
};
`,
};

// ── Frontend templates ────────────────────────────────────────────
const frontend = {
  "index.js": `import { ListTodo } from "lucide-react";

/** Feature manifest — auto-registered by src/app/features.js */
export default {
  name: "${n.plural}",
  routes: [{ path: "${n.plural}", lazy: () => import("./pages/${n.Plural}Page.jsx") }],
  nav: [{ label: "${n.label}", path: "/${n.plural}", icon: ListTodo }],
};
`,

  [`api/${n.plural}.api.js`]: `import { api } from "@/lib/api";

export const ${n.camelPlural}Api = {
  list: () => api.get("/${n.plural}"),
  get: (id) => api.get(\`/${n.plural}/\${id}\`),
  create: (data) => api.post("/${n.plural}", data),
  update: (id, data) => api.put(\`/${n.plural}/\${id}\`, data),
  remove: (id) => api.delete(\`/${n.plural}/\${id}\`),
};
`,

  [`api/${n.plural}.queries.js`]: `import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/lib/notify";
import { ${n.camelPlural}Api } from "./${n.plural}.api";

export const ${n.camelPlural}Keys = { all: ["${n.plural}"] };

export const use${n.Plural} = () =>
  useQuery({ queryKey: ${n.camelPlural}Keys.all, queryFn: ${n.camelPlural}Api.list });

function useInvalidatingMutation(mutationFn, successMessage) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ${n.camelPlural}Keys.all });
      notify.success(successMessage);
    },
    onError: (error) => notify.error(error.message),
  });
}

export const useCreate${n.Pascal} = () =>
  useInvalidatingMutation(${n.camelPlural}Api.create, "${n.Pascal} created");

export const useDelete${n.Pascal} = () =>
  useInvalidatingMutation(${n.camelPlural}Api.remove, "${n.Pascal} deleted");
`,

  [`pages/${n.Plural}Page.jsx`]: `import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { PageHeader } from "@/components/ui/PageHeader";
import { useCreate${n.Pascal}, useDelete${n.Pascal}, use${n.Plural} } from "../api/${n.plural}.queries";

const schema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  description: z.string().trim().max(5000).optional(),
});

export default function ${n.Plural}Page() {
  const { data: items = [], isPending, isError, error } = use${n.Plural}();
  const create = useCreate${n.Pascal}();
  const remove = useDelete${n.Pascal}();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => create.mutate(data, { onSuccess: () => reset() });

  return (
    <AnimatedPage>
      <PageHeader title="${n.label}" description="Generated with npm run generate ${n.name}" />

      <Paper variant="outlined" className="mb-6 p-4">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3 sm:flex-row">
          <TextField
            label="Title"
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField label="Description" {...register("description")} />
          <Button
            type="submit"
            variant="contained"
            loading={create.isPending}
            startIcon={<Plus size={18} />}
            className="shrink-0 self-start"
          >
            Add
          </Button>
        </form>
      </Paper>

      {isPending && <Skeleton variant="rounded" height={120} />}
      {isError && <Alert severity="error">{error.message}</Alert>}
      {!isPending && !isError && items.length === 0 && (
        <Typography color="text.secondary">No ${n.singularLabel} yet.</Typography>
      )}

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <Paper key={item.id} variant="outlined" className="flex items-center gap-4 p-4">
            <div className="flex-1">
              <Typography className="font-semibold">{item.title}</Typography>
              {item.description && (
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              )}
            </div>
            <IconButton color="error" onClick={() => remove.mutate(item.id)} aria-label="delete">
              <Trash2 size={18} />
            </IconButton>
          </Paper>
        ))}
      </div>
    </AnimatedPage>
  );
}
`,
};

// ── Write files ───────────────────────────────────────────────────
async function writeTree(baseDir, files) {
  if (existsSync(baseDir)) {
    console.error(`✖ ${path.relative(root, baseDir)} already exists — aborting (nothing written).`);
    process.exit(1);
  }
  for (const [file, content] of Object.entries(files)) {
    const target = path.join(baseDir, file);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, content);
    console.log(`  + ${path.relative(root, target).replaceAll("\\", "/")}`);
  }
}

const backendDir = path.join(root, "backend/src/modules", n.name);
const frontendDir = path.join(root, "frontend/src/features", n.plural);
const doBackend = !values["frontend-only"];
const doFrontend = !values["backend-only"];

// Check both targets first so we never leave a half-generated module behind.
for (const [enabled, dir] of [
  [doBackend, backendDir],
  [doFrontend, frontendDir],
]) {
  if (enabled && existsSync(dir)) {
    console.error(`✖ ${path.relative(root, dir)} already exists — aborting (nothing written).`);
    process.exit(1);
  }
}

console.log(`\nGenerating "${n.name}" module…\n`);
if (doBackend) await writeTree(backendDir, backend);
if (doFrontend) await writeTree(frontendDir, frontend);

console.log(`
✔ Done! Restart is automatic in dev (npm run dev).
${doBackend ? `  API   →  /api/${n.plural}   (table "${n.table}" is created on startup)\n` : ""}${doFrontend ? `  Page  →  /${n.plural}       (added to the navbar)\n` : ""}`);
