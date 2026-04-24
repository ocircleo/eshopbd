'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema } from '../../../validators/catalog.js'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Textarea } from '../../../components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import useInternalFetcher from '../../../utls/fetcher/useInternalFetcher'

export default function ProductsPage() {
  const [editing, setEditing] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: productsData, mutate: mutateProducts } = useInternalFetcher('/api/admin/products')
  const products = productsData?.products || []

  const { data: categories } = useInternalFetcher('/api/admin/categories')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(productSchema)
  })

  const onSubmit = async (data) => {
    const url = editing ? `/api/admin/products/${editing.id}` : '/api/admin/products'
    const method = editing ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (res.ok) {
      mutateProducts()
      setDialogOpen(false)
      reset()
      setEditing(null)
    }
  }

  const handleEdit = (product) => {
    setEditing(product)
    reset({
      title: product.title,
      price: product.price,
      category_id: product.category_id,
      short_description: product.short_description,
      details: product.details
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        mutateProducts()
      }
    }
  }

  const handleNew = () => {
    setEditing(null)
    reset()
    setDialogOpen(true)
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Products
            <Button onClick={handleNew}>Add Product</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(products || []).map((prod) => (
                <TableRow key={prod.id}>
                  <TableCell>{prod.id}</TableCell>
                  <TableCell>{prod.title}</TableCell>
                  <TableCell>${prod.price}</TableCell>
                  <TableCell>{(categories || []).find(c => c.id === prod.category_id)?.name}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(prod)} className="mr-2">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(prod.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>
            <div>
              <Label htmlFor="category_id">Category</Label>
              <Select onValueChange={(value) => setValue('category_id', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {(categories || []).map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id.message}</p>}
            </div>
            <div>
              <Label htmlFor="short_description">Short Description</Label>
              <Textarea id="short_description" {...register('short_description')} />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}