import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, X, AlertCircle, ArrowLeft } from 'lucide-react';
import productsService from '@/services/productsService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import useNotifications from '@/hooks/useNotifications';
import { PRODUCT_CATEGORIES, UNITS_OF_MEASURE, QUALITY_GRADES } from '@/types';

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: showError } = useNotifications();
  const isEditing = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: PRODUCT_CATEGORIES.VEGETABLES,
    price_per_unit: '',
    unit_of_measure: UNITS_OF_MEASURE.KG,
    quantity_available: '',
    minimum_order_quantity: '1',
    harvest_date: '',
    expiry_date: '',
    quality_grade: QUALITY_GRADES.STANDARD,
    is_organic: false,
  });

  useEffect(() => {
    if (isEditing) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      const product = await productsService.getProduct(id);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category || PRODUCT_CATEGORIES.VEGETABLES,
        price_per_unit: product.price_per_unit || '',
        unit_of_measure: product.unit_of_measure || UNITS_OF_MEASURE.KG,
        quantity_available: product.quantity_available || '',
        minimum_order_quantity: product.minimum_order_quantity || '1',
        harvest_date: product.harvest_date || '',
        expiry_date: product.expiry_date || '',
        quality_grade: product.quality_grade || QUALITY_GRADES.STANDARD,
        is_organic: product.is_organic || false,
      });
      if (product.images) {
        setImagePreviews(product.images);
      }
    } catch (err) {
      showError('Error', 'Failed to load product');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return false;
      }
      return true;
    });

    setImages([...images, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isEditing) {
        await productsService.updateProduct(id, formData);
        if (images.length > 0) {
          await productsService.uploadProductImages(id, images);
        }
        success('Success', 'Product updated successfully');
      } else {
        const newProduct = await productsService.createProduct(formData);
        if (images.length > 0) {
          await productsService.uploadProductImages(newProduct.id, images);
        }
        success('Success', 'Product created successfully');
      }
      navigate('/dashboard/farmer/products');
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Button
        variant="ghost"
        icon={ArrowLeft}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      <div>
        <h1 className="text-3xl font-bold mb-2">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-neutral-400">
          {isEditing ? 'Update your product details' : 'List a new product for sale'}
        </p>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card title="Basic Information">
          <div className="space-y-4">
            <Input
              label="Product Name"
              name="name"
              placeholder="e.g., Fresh Tomatoes"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows="4"
                placeholder="Describe your product..."
                value={formData.description}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  {Object.entries(PRODUCT_CATEGORIES).map(([key, value]) => (
                    <option key={key} value={value} className="capitalize">
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">
                  Quality Grade
                </label>
                <select
                  name="quality_grade"
                  value={formData.quality_grade}
                  onChange={handleChange}
                  className="input"
                >
                  {Object.entries(QUALITY_GRADES).map(([key, value]) => (
                    <option key={key} value={value} className="capitalize">
                      {value.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_organic"
                checked={formData.is_organic}
                onChange={handleChange}
                className="w-4 h-4 rounded border-neutral-700 bg-primary-light text-accent-cyan focus:ring-accent-teal"
              />
              <span className="text-sm text-neutral-300">Organic Product</span>
            </label>
          </div>
        </Card>

        {/* Pricing & Inventory */}
        <Card title="Pricing & Inventory">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Price per Unit"
              name="price_per_unit"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.price_per_unit}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Unit of Measure
              </label>
              <select
                name="unit_of_measure"
                value={formData.unit_of_measure}
                onChange={handleChange}
                className="input"
                required
              >
                {Object.entries(UNITS_OF_MEASURE).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Quantity Available"
              name="quantity_available"
              type="number"
              min="0"
              placeholder="100"
              value={formData.quantity_available}
              onChange={handleChange}
              required
            />

            <Input
              label="Minimum Order Quantity"
              name="minimum_order_quantity"
              type="number"
              min="1"
              placeholder="1"
              value={formData.minimum_order_quantity}
              onChange={handleChange}
            />
          </div>
        </Card>

        {/* Dates */}
        <Card title="Product Dates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Harvest Date"
              name="harvest_date"
              type="date"
              value={formData.harvest_date}
              onChange={handleChange}
            />

            <Input
              label="Expiry Date (Optional)"
              name="expiry_date"
              type="date"
              value={formData.expiry_date}
              onChange={handleChange}
            />
          </div>
        </Card>

        {/* Images */}
        <Card title="Product Images">
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-error rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              ))}

              {imagePreviews.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-neutral-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-accent-teal transition-colors">
                  <Upload className="text-neutral-500 mb-2" size={32} />
                  <span className="text-sm text-neutral-500">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-neutral-500">
              Maximum 5 images. Each image must be less than 5MB.
            </p>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
            fullWidth
          >
            {isEditing ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;