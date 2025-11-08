type Props = {
    name: string;
    imageUrl?: string;
};

export default function UserAvatar({ name, imageUrl }: Props) {
    return (
        <div className="flex items-center gap-2">
            <img
                src={imageUrl || "https://via.placeholder.com/40"}
                alt={name}
                className="w-8 h-8 rounded-full border"
            />
            <span className="hidden md:inline">{name}</span>
        </div>
    );
}
