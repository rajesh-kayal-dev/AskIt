import { useAuth } from '@/features/auth/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';

const StatCard: React.FC<{
    label: string;
    value: string | number;
    subtext?: string;
    bgColor?: string;
    textColor?: string;
}> = ({ label, value, subtext, bgColor = '#f0f9ff', textColor = '#0066cc' }) => (
    <Card padding="md" style={{ backgroundColor: bgColor }}>
        <div style={{ textAlign: 'center' }}>
            <div style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: '700',
                color: textColor,
                marginBottom: 'var(--spacing-xs)',
            }}>
                {value}
            </div>
            <div style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
            }}>
                {label}
            </div>
            {subtext && (
                <div style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-muted)',
                    marginTop: 'var(--spacing-xs)',
                }}>
                    {subtext}
                </div>
            )}
        </div>
    </Card>
);

const DashboardPage = () => {
    const { logout } = useAuth();
    const user = useSelector((state: RootState) => state.user.userData);

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'var(--color-bg-secondary)',
            padding: 'var(--spacing-lg)',
        }}>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-lg)',
            }}>
                <h1 style={{
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: '700',
                    color: 'var(--color-text-primary)',
                }}>
                    Dashboard
                </h1>
                <Button variant="danger" size="sm" onClick={logout}>
                    Logout
                </Button>
            </header>

            <Card style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                }}>
                    {(user?.avatar || user?.picture) && (
                        <img
                            src={user?.avatar || user?.picture}
                            alt={user.name}
                            style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid var(--color-bg-tertiary, #e0e0e0)',
                            }}
                        />
                    )}
                    <div>
                        <h2 style={{
                            fontSize: 'var(--font-size-lg)',
                            fontWeight: '600',
                            marginBottom: 'var(--spacing-xs)',
                            color: 'var(--color-text-primary)',
                        }}>
                            {user?.name || 'User'}
                        </h2>
                        <p style={{
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--color-text-secondary)',
                        }}>
                            {user?.email || 'No email'}
                        </p>
                    </div>
                </div>
            </Card>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--spacing-md)',
            }}>
                <StatCard
                    label="Credits Remaining"
                    value={user?.credits ?? 0}
                    subtext="Used for API calls"
                    bgColor="#f0fdf4"
                    textColor="#16a34a"
                />

                <StatCard
                    label="Current Plan"
                    value={user?.plan || 'free'}
                    subtext="Upgrade for more"
                    bgColor="#fefce8"
                    textColor="#ca8a04"
                />

                <StatCard
                    label="Member Since"
                    value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    bgColor="#faf5ff"
                    textColor="#9333ea"
                />
            </div>
        </div>
    );
};

export default DashboardPage;