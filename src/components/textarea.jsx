export function Textarea({ className, ...props }) {
    return (
      <textarea
        className={`w-full p-2 border rounded-lg focus:ring-2 focus:outline-none ${className}`}
        {...props}
      />
    );
  }