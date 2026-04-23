'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { promotionSchema } from '../../../validators/promotion.js'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Switch } from '../../../components/ui/switch'

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState([])
  const [editing, setEditing] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(promotionSchema)
  })

  useEffect(() => {
    fetchPromotions()
  }, [])

  const fetchPromotions = async () => {
    const res = await fetch('/api/admin/promotions')
    if (res.ok) {
      const data = await res.json()
      setPromotions(data)
    }
  }

  const handleImageUpload = async (file) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/admin/promotions/upload', {
      method: 'POST',
      body: formData
    })

    if (res.ok) {
      const { url } = await res.json()
      setValue('image_url', url)
    }
    setUploading(false)
  }

  const onSubmit = async (data) => {
    const url = editing ? `/api/admin/promotions/${editing.id}` : '/api/admin/promotions'
    const method = editing ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (res.ok) {
      fetchPromotions()
      setDialogOpen(false)
      reset()
      setEditing(null)
    }
  }

  const handleEdit = (promo) => {
    setEditing(promo)
    reset({
      image_url: promo.image_url,
      redirect_url: promo.redirect_url,
      sort_order: promo.sort_order,
      is_active: promo.is_active
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      const res = await fetch(`/api/admin/promotions/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchPromotions()
      }
    }
  }

  const handleNew = () => {
    setEditing(null)
    reset()
    setDialogOpen(true)
  }

  const toggleActive = async (id, current) => {
    const res = await fetch(`/api/admin/promotions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !current })
    })
    if (res.ok) {
      fetchPromotions()
    }
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Promotions
            <Button onClick={handleNew}>Add Promotion</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Redirect URL</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell>{promo.id}</TableCell>
                  <TableCell>
                    <img src={promo.image_url} alt="Promotion" className="w-16 h-16 object-cover" />
                  </TableCell>
                  <TableCell>{promo.redirect_url}</TableCell>
                  <TableCell>{promo.sort_order}</TableCell>
                  <TableCell>
                    <Switch
                      checked={promo.is_active}
                      onCheckedChange={() => toggleActive(promo.id, promo.is_active)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(promo)} className="mr-2">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(promo.id)}>
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
            <DialogTitle>{editing ? 'Edit Promotion' : 'Add Promotion'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])}
                disabled={uploading}
              />
              {uploading && <p>Uploading...</p>}
              {watch('image_url') && (
                <img src={watch('image_url')} alt="Preview" className="w-32 h-32 object-cover mt-2" />
              )}
              <Input type="hidden" {...register('image_url')} />
              {errors.image_url && <p className="text-red-500 text-sm">{errors.image_url.message}</p>}
            </div>
            <div>
              <Label htmlFor="redirect_url">Redirect URL</Label>
              <Input id="redirect_url" {...register('redirect_url')} />
              {errors.redirect_url && <p className="text-red-500 text-sm">{errors.redirect_url.message}</p>}
            </div>
            <div>
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input id="sort_order" type="number" {...register('sort_order', { valueAsNumber: true })} />
              {errors.sort_order && <p className="text-red-500 text-sm">{errors.sort_order.message}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="is_active" {...register('is_active')} />
              <Label htmlFor="is_active">Active</Label>
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