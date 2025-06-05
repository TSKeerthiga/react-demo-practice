import React, { useEffect } from 'react';
import type { FormEvent } from 'react';
import { useForm, SubmitHandler, UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Employee } from '../../types/Employee';

// Zod schema for form validation
const employeeSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string()
    .email('Invalid email address')
    .max(100, 'Email must be less than 100 characters'),
  designation: z.string()
    .min(2, 'Designation must be at least 2 characters')
    .max(50, 'Designation must be less than 50 characters'),
});

// Types
type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  initialData?: Employee;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  onCancel: () => void;
  title: string;
  isLoading?: boolean;
  onFormChange?: () => void;
}

interface FormFieldProps {
  id: keyof EmployeeFormData;
  label: string;
  type?: string;
  placeholder: string;
  error?: string;
  disabled: boolean;
  register: UseFormRegister<EmployeeFormData>;
}

// Components
const LoadingSpinner: React.FC = () => (
  <div 
    className="inline-block animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" 
    role="status"
    aria-label="Loading"
  >
    <span className="sr-only">Loading...</span>
  </div>
);

const FormField: React.FC<FormFieldProps> = ({ 
  id, 
  label, 
  type = "text", 
  placeholder, 
  error, 
  disabled, 
  register 
}) => (
  <div className="relative">
    <label 
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
      <span className="text-red-500 ml-1">*</span>
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      {...register(id)}
      className={`w-full px-4 py-2.5 rounded-lg border ${
        error 
          ? 'border-red-500 focus:ring-red-500' 
          : 'border-gray-300 focus:ring-blue-500'
      } focus:border-transparent focus:outline-hidden focus:ring-2 transition-all duration-200
        ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
      `}
      disabled={disabled}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={error ? `${id}-error` : undefined}
    />
    {error && (
      <p 
        id={`${id}-error`}
        className="mt-1 text-xs text-red-500 absolute" 
        role="alert"
      >
        {error}
      </p>
    )}
  </div>
);

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  title,
  isLoading = false,
  onFormChange
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      designation: '',
    },
  });

  // Watch for form changes
  useEffect(() => {
    const subscription = watch(() => {
      onFormChange?.();
    });
    return () => subscription.unsubscribe();
  }, [watch, onFormChange]);

  const onSubmitHandler: SubmitHandler<EmployeeFormData> = async (data) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void handleSubmit(onSubmitHandler)(e);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="px-8 py-6 bg-linear-to-r from-blue-600 to-blue-700">
        <h2 className="text-2xl font-bold text-white text-center">{title}</h2>
      </div>

      <form 
        onSubmit={handleFormSubmit}
        className="p-8 space-y-6" 
        noValidate
      >
        <div className="space-y-6">
          <FormField
            id="name"
            label="Name"
            placeholder="Enter employee name"
            error={errors.name?.message}
            disabled={isLoading || isSubmitting}
            register={register}
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="Enter employee email"
            error={errors.email?.message}
            disabled={isLoading || isSubmitting}
            register={register}
          />

          <FormField
            id="designation"
            label="Designation"
            placeholder="Enter employee designation"
            error={errors.designation?.message}
            disabled={isLoading || isSubmitting}
            register={register}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6 mt-8 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 
                     hover:bg-gray-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2 
                     focus:ring-gray-500 transition-all duration-200 transform hover:scale-105 
                     active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-white 
                     bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 
                     hover:to-blue-800 focus:outline-hidden focus:ring-2 focus:ring-offset-2 
                     focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 
                     active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed 
                     shadow-md hover:shadow-lg"
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting ? (
              <LoadingSpinner />
            ) : initialData ? (
              'Update Employee'
            ) : (
              'Add Employee'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm; 