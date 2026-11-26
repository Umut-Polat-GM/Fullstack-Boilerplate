import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";

export function ProductCard({ product, onEdit, onDelete }) {
  return (
    <Card
      variant="outlined"
      className="group flex h-full flex-col transition-shadow hover:shadow-lg"
    >
      <div className="overflow-hidden">
        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
          loading="lazy"
          className="aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="flex-1">
        <Typography variant="subtitle1" className="font-semibold" noWrap title={product.name}>
          {product.name}
        </Typography>
        <Typography variant="h6" color="primary" className="font-bold">
          {formatCurrency(product.price)}
        </Typography>
      </CardContent>
      <CardActions className="justify-end">
        <Tooltip title="Edit">
          <IconButton onClick={() => onEdit(product)} size="small" color="primary">
            <Pencil size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton onClick={() => onDelete(product)} size="small" color="error">
            <Trash2 size={16} />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}
