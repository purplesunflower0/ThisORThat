import Image from "next/image";

interface OptionBoxProps {
  name: string;
  imageUrl: string;
  onClick: () => void;
}

export default function OptionBox({ name, imageUrl, onClick }: OptionBoxProps) {
  return (
    <div
      onClick={onClick}
      className="w-40 h-48 flex flex-col cursor-pointer rounded-xl shadow-md overflow-hidden border border-gray-200 hover:scale-105 transition-transform"
    >
      {/* Image Container */}
      <div className="flex-1 relative w-full">
        <Image
          src={imageUrl}
          alt={name}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Option name bar */}
      <div className="h-10 flex items-center justify-center bg-black text-white text-sm font-semibold">
        {name}
      </div>
    </div>
  );
}
