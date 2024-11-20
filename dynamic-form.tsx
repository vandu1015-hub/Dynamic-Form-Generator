import React, { useState, FormEvent } from 'react';

// Internal type definitions
interface ValidationRule {
  pattern?: string;
  message?: string;
}

interface FieldOption {
  value: string;
  label: string;
}

interface FormField {
  id: string;
  type: 'text' | 'email' | 'select' | 'radio' | 'textarea';
  label: string;
  required: boolean;
  placeholder?: string;
  validation?: ValidationRule;
  options?: FieldOption[];
}

interface FormSchema {
  formTitle: string;
  formDescription: string;
  fields: FormField[];
}

interface DynamicFormProps {
  schema: FormSchema;
  isDarkMode: boolean;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ schema, isDarkMode }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (field: FormField, value: string): string => {
    if (field.required && !value) {
      return 'This field is required';
    }

    if (field.validation?.pattern && value) {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(value)) {
        return field.validation.message || 'Invalid format';
      }
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    return '';
  };

  const handleChange = (field: FormField, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field.id]: value
    }));

    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field.id]: error
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    schema.fields.forEach(field => {
      const error = validateField(field, formData[field.id] || '');
      if (error) {
        newErrors[field.id] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form submitted:', formData);
      
      // Reset form
      setFormData({});
      setErrors({});
      alert('Form submitted successfully!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const commonClasses = `w-full p-2 rounded border ${
      isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'
    } ${errors[field.id] ? 'border-red-500' : 'border-gray-300'}`;

    const commonProps = {
      id: field.id,
      value: formData[field.id] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
        handleChange(field, e.target.value),
      className: commonClasses,
      placeholder: field.placeholder,
      required: field.required
    };

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={field.type}
            {...commonProps}
          />
        );

      case 'textarea':
        return (
          <textarea
            {...commonProps}
            className={`${commonClasses} h-32`}
          />
        );

      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <label
                key={option.value}
                className={`flex items-center space-x-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={formData[field.id] === option.value}
                  onChange={e => handleChange(field, e.target.value)}
                  className="form-radio"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {schema.formTitle}
      </h2>
      <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {schema.formDescription}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {schema.fields.map(field => (
          <div key={field.id} className="space-y-2">
            <label
              htmlFor={field.id}
              className={`block font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-700'
              }`}
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field)}
            {errors[field.id] && (
              <p className="text-red-500 text-sm">
                {errors[field.id]}
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded font-medium ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default DynamicForm;
