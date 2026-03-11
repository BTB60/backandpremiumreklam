"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { products, type Product, type ProductCategory } from "@/lib/db";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Package,
  Tag,
  DollarSign,
  CheckCircle,
  XCircle,
  Folder,
} from "lucide-react";

interface ProductsManagerProps {
  initialProducts: Product[];
  initialCategories: ProductCategory[];
}

export function ProductsManager({ initialProducts, initialCategories }: ProductsManagerProps) {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [categoryList, setCategoryList] = useState<ProductCategory[]>(initialCategories);
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    category: "",
    basePrice: "",
    unit: "m²" as "m²" | "ədəd" | "metr",
    minOrder: "1",
    isActive: true,
  });

  // Category Form State
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    order: "",
  });

  const filteredProducts = productList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProduct = () => {
    if (!productForm.name || !productForm.category || !productForm.basePrice) return;

    const newProduct = products.create({
      name: productForm.name,
      description: productForm.description,
      category: productForm.category,
      basePrice: parseFloat(productForm.basePrice),
      unit: productForm.unit,
      minOrder: parseInt(productForm.minOrder) || 1,
      isActive: productForm.isActive,
    });

    setProductList([...productList, newProduct]);
    setShowProductForm(false);
    resetProductForm();
  };

  const handleUpdateProduct = () => {
    if (!editingProduct || !productForm.name) return;

    const updated = products.update(editingProduct.id, {
      name: productForm.name,
      description: productForm.description,
      category: productForm.category,
      basePrice: parseFloat(productForm.basePrice),
      unit: productForm.unit,
      minOrder: parseInt(productForm.minOrder) || 1,
      isActive: productForm.isActive,
    });

    if (updated) {
      setProductList(productList.map((p) => (p.id === updated.id ? updated : p)));
    }
    setShowProductForm(false);
    setEditingProduct(null);
    resetProductForm();
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Məhsulu silmək istədiyinizə əminsiniz?")) {
      products.delete(id);
      setProductList(productList.filter((p) => p.id !== id));
    }
  };

  const handleCreateCategory = () => {
    if (!categoryForm.name) return;

    const newCategory = products.createCategory({
      name: categoryForm.name,
      description: categoryForm.description,
      order: parseInt(categoryForm.order) || categoryList.length + 1,
    });

    setCategoryList([...categoryList, newCategory]);
    setShowCategoryForm(false);
    resetCategoryForm();
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !categoryForm.name) return;

    const updated = products.updateCategory(editingCategory.id, {
      name: categoryForm.name,
      description: categoryForm.description,
      order: parseInt(categoryForm.order) || editingCategory.order,
    });

    if (updated) {
      setCategoryList(categoryList.map((c) => (c.id === updated.id ? updated : c)));
    }
    setShowCategoryForm(false);
    setEditingCategory(null);
    resetCategoryForm();
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm("Kateqoriyanı silmək istədiyinizə əminsiniz? Bu kateqoriyadakı məhsullar təsirlənəcək.")) {
      products.deleteCategory(id);
      setCategoryList(categoryList.filter((c) => c.id !== id));
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      category: "",
      basePrice: "",
      unit: "m²",
      minOrder: "1",
      isActive: true,
    });
  };

  const resetCategoryForm = () => {
    setCategoryForm({ name: "", description: "", order: "" });
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      category: product.category,
      basePrice: product.basePrice.toString(),
      unit: product.unit,
      minOrder: product.minOrder.toString(),
      isActive: product.isActive,
    });
    setShowProductForm(true);
  };

  const startEditCategory = (category: ProductCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      order: category.order.toString(),
    });
    setShowCategoryForm(true);
  };

  const getCategoryName = (id: string) => {
    return categoryList.find((c) => c.id === id)?.name || "Naməlum";
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 font-medium ${
            activeTab === "products"
              ? "text-[#D90429] border-b-2 border-[#D90429]"
              : "text-gray-500"
          }`}
        >
          <Package className="w-4 h-4 inline mr-2" />
          Məhsullar ({productList.length})
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2 font-medium ${
            activeTab === "categories"
              ? "text-[#D90429] border-b-2 border-[#D90429]"
              : "text-gray-500"
          }`}
        >
          <Folder className="w-4 h-4 inline mr-2" />
          Kateqoriyalar ({categoryList.length})
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === "products" && (
        <>
          {/* Search and Add */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Məhsul axtar..."
                value={searchQuery}
                onChange={(value) => setSearchQuery(value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => {
                setEditingProduct(null);
                resetProductForm();
                setShowProductForm(true);
              }}
              icon={<Plus className="w-4 h-4" />}
            >
              Yeni Məhsul
            </Button>
          </div>

          {/* Product Form */}
          {showProductForm && (
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">
                {editingProduct ? "Məhsulu Redaktə Et" : "Yeni Məhsul"}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ad</label>
                  <Input
                    value={productForm.name}
                    onChange={(value) => setProductForm({ ...productForm, name: value })}
                    placeholder="Məhsul adı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Kateqoriya</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Seçin</option>
                    {categoryList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Əsas Qiymət (AZN)</label>
                  <Input
                    type="number"
                    value={productForm.basePrice}
                    onChange={(value) => setProductForm({ ...productForm, basePrice: value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Vahid</label>
                  <select
                    value={productForm.unit}
                    onChange={(e) =>
                      setProductForm({ ...productForm, unit: e.target.value as "m²" | "ədəd" | "metr" })
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="m²">m² (kvadrat metr)</option>
                    <option value="ədəd">ədəd (say)</option>
                    <option value="metr">metr (uzunluq)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Min Sifariş</label>
                  <Input
                    type="number"
                    value={productForm.minOrder}
                    onChange={(value) => setProductForm({ ...productForm, minOrder: value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={productForm.isActive}
                    onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label className="text-sm font-medium">Aktiv</label>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Təsvir</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    placeholder="Məhsul təsviri..."
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={editingProduct ? handleUpdateProduct : handleCreateProduct}
                  icon={<CheckCircle className="w-4 h-4" />}
                >
                  {editingProduct ? "Yenilə" : "Yarat"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                  }}
                  icon={<XCircle className="w-4 h-4" />}
                >
                  Ləğv Et
                </Button>
              </div>
            </Card>
          )}

          {/* Products List */}
          <div className="grid gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className={`p-4 ${!product.isActive ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold">{product.name}</h4>
                      {product.isActive ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-xs rounded-full">
                          Aktiv
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                          Deaktiv
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1">
                        <Folder className="w-3 h-3" />
                        {getCategoryName(product.category)}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {product.basePrice} AZN / {product.unit}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        Min: {product.minOrder}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditProduct(product)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <>
          <div className="flex justify-end">
            <Button
              onClick={() => {
                setEditingCategory(null);
                resetCategoryForm();
                setShowCategoryForm(true);
              }}
              icon={<Plus className="w-4 h-4" />}
            >
              Yeni Kateqoriya
            </Button>
          </div>

          {/* Category Form */}
          {showCategoryForm && (
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">
                {editingCategory ? "Kateqoriyanı Redaktə Et" : "Yeni Kateqoriya"}
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ad</label>
                  <Input
                    value={categoryForm.name}
                    onChange={(value) => setCategoryForm({ ...categoryForm, name: value })}
                    placeholder="Kateqoriya adı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sıra</label>
                  <Input
                    type="number"
                    value={categoryForm.order}
                    onChange={(value) => setCategoryForm({ ...categoryForm, order: value })}
                    placeholder="Sıra nömrəsi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Təsvir</label>
                  <Input
                    value={categoryForm.description}
                    onChange={(value) => setCategoryForm({ ...categoryForm, description: value })}
                    placeholder="Qısa təsvir"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                  icon={<CheckCircle className="w-4 h-4" />}
                >
                  {editingCategory ? "Yenilə" : "Yarat"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowCategoryForm(false);
                    setEditingCategory(null);
                  }}
                  icon={<XCircle className="w-4 h-4" />}
                >
                  Ləğv Et
                </Button>
              </div>
            </Card>
          )}

          {/* Categories List */}
          <div className="grid gap-2">
            {categoryList
              .sort((a, b) => a.order - b.order)
              .map((category) => (
                <Card key={category.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 bg-[#D90429] text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {category.order}
                      </span>
                      <div>
                        <h4 className="font-bold">{category.name}</h4>
                        <p className="text-sm text-gray-500">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditCategory(category)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
