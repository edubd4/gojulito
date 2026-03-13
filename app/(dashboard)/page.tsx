export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1
        className="text-2xl font-bold mb-2"
        style={{ fontFamily: 'Fraunces, serif', color: '#e8e6e0' }}
      >
        Dashboard
      </h1>
      <p style={{ color: '#9ba8bb', fontFamily: 'DM Sans, sans-serif' }}>
        En construcción — las métricas se implementarán en el próximo sprint.
      </p>
    </div>
  )
}
