/* eslint-disable react-refresh/only-export-components */
// Project 1: Multi-Step Form

import { Children, createContext, useState } from "react";

const FormContext = createContext();

function MultiStepForm({ children, onSubmit }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const steps = Children.toArray(children);
  const isLastStep = currentStep === steps.length - 1;

  const next = () => {
    if (!isLastStep) setCurrentStep(prev => prev + 1);
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep(prev => prev + 1);
  };

  const updateFormData = (data) => {
    setFormData(prev => ({...prev, ...data}));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <FormContext.Provider value={{
      formData,
      updateFormData,
      next,
      prev,
      isLastStep,
      currentStep,
      totalSteps: steps.length
    }}>
      <div className="multi-step-form">
        <div className="progress-bar">
          Step {currentStep + 1} of {steps.length}
        </div>
        {steps[currentStep]}
        <div className="form-navigation">
          {currentStep > 0 && <button onClick={prev}>Previous</button>}
          {!isLastStep ? (
            <button onClick={next}>Next</button>
          ) : (
            <button onClick={handleSubmit}>Submit</button>
          )}
        </div>
      </div>
    </FormContext.Provider>
  );
}

MultiStepForm.Step = function FormStep({ children }) {
  return <div className="form-step">{children}</div>;
};

// Usage
function RegistrationForm() {
  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <MultiStepForm onSubmit={handleSubmit}>
      <MultiStepForm.Step>
        <PersonalInfoStep />
      </MultiStepForm.Step>
      <MultiStepForm.Step>
        <AddressStep />
      </MultiStepForm.Step>
      <MultiStepForm.Step>
        <ConfirmationStep />
      </MultiStepForm.Step>
    </MultiStepForm>
  )
}