import ShippingAddressesSection from './Direcciones/ShippingAddressesSection';
import MyOrdersSection from './Ordenes/MyOrdersSection';

interface AccountSectionProps {
  section: 'addresses' | 'orders';
}

const AccountSection = ({ section }: AccountSectionProps) => {
  return (
    <div >
      {section === 'addresses' && <ShippingAddressesSection />}
      {section === 'orders' && <MyOrdersSection />}
    </div>
  );
};

export default AccountSection;
