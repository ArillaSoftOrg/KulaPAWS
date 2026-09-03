import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import type { Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card as="article" interactive className="relative flex flex-col gap-4 p-4">
      <PhotoPlaceholder src={product.imageSrc} label={product.name} aspect="square" />
      <div>
        <h3 className="text-[17px] font-semibold text-foreground">
          <Link
            href={`/products/${product.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-[14px] text-muted-foreground">{product.shortDescription}</p>
        {product.price && (
          <p className="mt-2 text-[15px] font-medium text-foreground">{product.price}</p>
        )}
      </div>
    </Card>
  );
}
