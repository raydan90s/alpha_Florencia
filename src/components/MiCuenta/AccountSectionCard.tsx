interface AccountSectionCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  iconColor: string;
  onClick: () => void;
}

const AccountSectionCard = ({ title, description, icon, color, iconColor, onClick }: AccountSectionCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`
        ${color} border-2 rounded-xl p-6 cursor-pointer 
        transition-all duration-200 hover:shadow-lg hover:scale-[1.02]
        flex flex-col items-center text-center
      `}
    >
      <div className={`text-4xl mb-4 ${iconColor}`}>{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <button className="bg-white px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
        Ver →
      </button>
    </div>
  );
};

export default AccountSectionCard;
