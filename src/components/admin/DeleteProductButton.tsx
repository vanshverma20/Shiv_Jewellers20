"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${productName}"?\n\nThis will permanently remove the product and its QR code. This cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${productId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete product");
        return;
      }
      router.refresh();
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      title="Delete product"
      className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-1 disabled:opacity-50 transition-colors"
    >
      {isDeleting ? (
        <Loader2 size={15} className="animate-spin" />
      ) : (
        <Trash2 size={15} />
      )}
      Delete
    </button>
  );
}
