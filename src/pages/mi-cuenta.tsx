'use client';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import AccountHeader from '../components/MiCuenta/AccountHeader';
import AccountLoading from '../components/MiCuenta/AccountLoading';
import AccountError from '../components/MiCuenta/AccountError';
import AccountSectionCard from '../components/MiCuenta/AccountSectionCard';
import AccountSummaryStats from '../components/MiCuenta/AccountSummaryStats';
import AccountSection from '../components/MiCuenta/AccountSection';
import { useAddresses } from '../hooks/useAddresses';
import { useOrders } from '../hooks/useOrders';

type SectionType = 'overview' | 'addresses' | 'orders';

const MyAccountPage = () => {
  const { user } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState<SectionType>('overview');
  const [mounted, setMounted] = useState(false);
  const { orders, loading: loadingOrders, fetchOrders } = useOrders(user?.id);
  const { addresses, loading: loadingAddresses, fetchAddresses } = useAddresses(user?.id);

  useEffect(() => {
    if (user?.id) {
      fetchAddresses();
      fetchOrders(); 
    }
  }, [user?.id]);


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <AccountLoading />;
  if (!user) return <AccountError />;

  const menuCards = [
    {
      id: 'addresses' as SectionType,
      title: 'Mis Direcciones',
      description: 'Gestiona tus direcciones de envío',
      icon: '📍',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 'orders' as SectionType,
      title: 'Mis Pedidos',
      description: 'Revisa el estado de tus compras',
      icon: '🛒',
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      iconColor: 'text-green-600'
    },
  ];

  if (activeSection === 'overview') {
    return (
      <div className="max-w-6xl mx-auto p-5">
        <AccountHeader title="Mi Cuenta" subtitle={`Bienvenido, ${user.nombre || user.email}`} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {menuCards.map((card) => (
            <AccountSectionCard
              key={card.id}
              {...card}
              onClick={() => setActiveSection(card.id)}
            />
          ))}
        </div>

        {loadingAddresses || loadingOrders ? (
          <AccountLoading />
        ) : (
          <AccountSummaryStats
            stats={{
              direcciones: addresses.length,
              pedidos: orders.length,
              totalGastado: orders.reduce((acc, o) => acc + o.total, 0),
            }}
          />
        )}
      </div>
    );
  }


  return (
    <div className="max-w-6xl mx-auto p-5">
      <AccountHeader
        title=""
        showBackButton
        onBack={() => setActiveSection('overview')}
      />
      <AccountSection section={activeSection} />
    </div>
  );
};

export default MyAccountPage;
