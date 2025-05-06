interface UserAvatarProps {
  foto?: string;
  nome?: string;
  size?: number; // tamanho em px (ex: 40, 60, 80)
}

export default function UserAvatar({ foto, nome, size = 40 }: UserAvatarProps) {
  const displaySize = `${size}px`;

  const isUrl = foto?.startsWith("http");
  const imgSrc = foto
    ? isUrl
      ? foto
      : `${import.meta.env.VITE_API_URL}/uploads/fotos-perfil/${foto}`
    : null;

  console.log("isUrl :>> ", isUrl);
  console.log("imgSrc :>> ", imgSrc);

  return (
    <div
      className="rounded-full overflow-hidden bg-gray-300 flex items-center justify-center text-white font-bold"
      style={{ width: displaySize, height: displaySize, fontSize: size * 0.4 }}
    >
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={nome || "Avatar"}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span>{nome?.[0]?.toUpperCase() || "?"}</span>
      )}
    </div>
  );
}
