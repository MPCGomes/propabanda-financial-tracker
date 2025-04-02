type PlaceholderComponent = {
  text: string;
};

export default function PlaceholderComponent({ text }: PlaceholderComponent) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      <p className="text-gray-700 text-lg">{text}</p>
    </div>
  );
}
