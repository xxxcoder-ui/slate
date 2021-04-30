import * as React from "react";

export const useForm = ({ onSubmit, initialValues }) => {
  const [state, setState] = React.useState({ isSubmitting: false, values: initialValues });

  const handleFieldChange = (e) =>
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, [e.target.name]: e.target.value },
    }));

  // Note(Amine): this prop getter will capture the field state
  const getFieldProps = (name) => ({
    name: name,
    value: state.values[name],
    onChange: handleFieldChange,
  });

  const handleFormOnSubmit = async (e) => {
    e.preventDefault();
    try {
      setState((prev) => ({ ...prev, isSubmitting: true }));
      await onSubmit(state.values);
      setState((prev) => ({ ...prev, isSubmitting: false }));
    } catch (error) {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  // Note(Amine): this prop getter will overide the form onSubmit handler
  const getFormProps = () => ({
    onSubmit: handleFormOnSubmit,
  });

  return { getFieldProps, getFormProps, values: state.values, isSubmitting: state.isSubmitting };
};
