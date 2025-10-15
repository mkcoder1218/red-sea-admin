"use client";
import React, { useState, useEffect } from "react";
import useAxios from "axios-hooks";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { CategoriesRoot } from "@/store/types/categories";
import { axiosClient } from "@/services/axiosHook";

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string | null;
  backgroundColor?: string | null;
  createdAt: string;
  updatedAt: string;
  productCount: number;
}

export default function CategoriesPage() {
  // Fetch categories
  const [{ data }, refetch] = useAxios<CategoriesRoot>({
    url: "/categories",
    method: "GET",
  });

  // Create category request
  const [, createCategory] = useAxios(
    { url: "/categories", method: "POST" },
    { manual: true }
  );

  // Update category request
  const [, updateCategory] = useAxios(
    { url: "/categories", method: "PUT" },
    { manual: true }
  );
console.log('apiclient--->',axiosClient)
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    color: "#000000",
    backgroundColor: "#ffffff",
  });
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (data?.data?.rows) setCategories(data.data.rows);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create new category
  const handleCreate = async () => {
    try {
      const response = await createCategory({ data: formData });
      const newCategory = response.data;
      setCategories((prev) => [...prev, newCategory]);
      setFormData({ name: "", description: "", icon: "", color: "#000000", backgroundColor: "#ffffff" });
      toast({ title: "Category Created", description: `${newCategory.name} has been added.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to create category" });
    }
  };

  // Open modal to edit
  const handleRowClick = (cat: Category) => {
    setSelectedCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || "",
      icon: cat.icon || "",
      color: cat.color || "#000000",
      backgroundColor: cat.backgroundColor || "#ffffff",
    });
    setShowModal(true);
  };

  // Update category
  const handleUpdate = async () => {
    if (!selectedCategory) return;

    try {
      const response = await updateCategory({
        url: `/categories`,
        method: "PUT",
        data: {...formData,id:selectedCategory.id},
      });

      const updated = response.data;
      setCategories((prev) =>
        prev.map((cat) => (cat.id === updated.id ? updated : cat))
      );
      setShowModal(false);
      toast({ title: "Category Updated", description: `${updated.name} has been updated.` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to update category" });
    }
  };

  return (
    <div className="p-6 bg-[hsl(var(--background))] text-[hsl(var(--foreground))] min-h-screen">
      {/* Create Form */}
      <Card className="max-w-3xl mx-auto mb-8 border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Create Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
          <Textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
          <Input name="icon" placeholder="SVG Icon (as string)" value={formData.icon} onChange={handleChange} />
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <label className="text-sm mb-1">Text Color</label>
              <input type="color" name="color" value={formData.color} onChange={handleChange} className="w-10 h-10 border border-[hsl(var(--border))] rounded-md cursor-pointer" />
            </div>
            <div className="flex flex-col">
              <label className="text-sm mb-1">Background Color</label>
              <input type="color" name="backgroundColor" value={formData.backgroundColor} onChange={handleChange} className="w-10 h-10 border border-[hsl(var(--border))] rounded-md cursor-pointer" />
            </div>
          </div>
          <Button onClick={handleCreate} className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--accent))]">Create</Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="max-w-5xl mx-auto border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-[hsl(var(--muted))]">
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Background</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map((cat) => (
                <TableRow key={cat.id} className="cursor-pointer hover:bg-[hsl(var(--muted))]" onClick={() => handleRowClick(cat)}>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.description}</TableCell>
                  <TableCell>
                  <TableCell>
                    <div className={`p-2 rounded-sm bg-[${cat?.backgroundColor}]`}  style={{ backgroundColor: cat?.backgroundColor || 'transparent' }}>
 <div
      className="w-6 h-6"
      dangerouslySetInnerHTML={{
        __html: cat.icon
          // Remove width/height
          .replace(/(width|height)="[^"]*"/g, "")
          // Only replace fill if not "none"
          .replace(/fill="(?!none)[^"]*"/g, `fill="${cat.color || 'currentColor'}"`)
          // Only replace stroke if not "none"
          .replace(/stroke="(?!none)[^"]*"/g, `stroke="${cat.color || 'currentColor'}"`)
          // Add full size scaling
          .replace('<svg', '<svg class="w-full h-full" preserveAspectRatio="xMidYMid meet"'),
      }}
    />
</div>
</TableCell>

                  </TableCell>
                  <TableCell>{cat.productCount}</TableCell>
                  <TableCell><div className="w-6 h-6 rounded" style={{ background: cat.color || "transparent", border: "1px solid hsl(var(--border))" }} /></TableCell>
                  <TableCell><div className="w-6 h-6 rounded" style={{ background: cat.backgroundColor || "transparent", border: "1px solid hsl(var(--border))" }} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Update Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[hsl(var(--card))] p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Update Category</h2>
            <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
            <Textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
            <Input name="icon" placeholder="SVG Icon" value={formData.icon} onChange={handleChange} />
            <div className="flex items-center gap-4 my-2">
              <div className="flex flex-col">
                <label className="text-sm mb-1">Text Color</label>
                <input type="color" name="color" value={formData.color} onChange={handleChange} className="w-10 h-10 border rounded-md" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm mb-1">Background Color</label>
                <input type="color" name="backgroundColor" value={formData.backgroundColor} onChange={handleChange} className="w-10 h-10 border rounded-md" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setShowModal(false)} variant="outline">Cancel</Button>
              <Button onClick={handleUpdate}>Update</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
