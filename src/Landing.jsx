import { Link } from 'react-router-dom'
import './Landing.css'

const FEATURES = [
  {
    icon: '📄',
    title: 'Cumplimiento normativo',
    desc: 'Genera comprobantes electrónicos válidos ante la autoridad fiscal, siempre actualizados con la normativa vigente.',
  },
  {
    icon: '⚡',
    title: 'Emisión en segundos',
    desc: 'Crea y envía facturas, notas de crédito y recibos en un par de clics, desde cualquier dispositivo.',
  },
  {
    icon: '🔗',
    title: 'Integración contable',
    desc: 'Conecta tu facturación con tu sistema contable o ERP y elimina la doble digitación.',
  },
  {
    icon: '📊',
    title: 'Reportes en tiempo real',
    desc: 'Visualiza tus ventas, impuestos recaudados y estado de cobros desde un panel centralizado.',
  },
  {
    icon: '🔒',
    title: 'Respaldo seguro',
    desc: 'Tus comprobantes quedan almacenados y respaldados en la nube, disponibles cuando los necesites.',
  },
  {
    icon: '🤝',
    title: 'Soporte dedicado',
    desc: 'Un equipo de soporte te acompaña en la implementación y resuelve tus dudas cuando lo necesites.',
  },
]

const STEPS = [
  { number: '01', title: 'Crea tu cuenta', desc: 'Regístrate y configura los datos de tu negocio en minutos.' },
  { number: '02', title: 'Emite tu factura', desc: 'Completa los datos del cliente y los productos o servicios.' },
  { number: '03', title: 'Envía y listo', desc: 'El comprobante se valida y se envía automáticamente a tu cliente.' },
]

const PLANS = [
  {
    name: 'Emprendedor',
    price: '$9',
    period: '/mes',
    desc: 'Ideal para independientes y negocios que están empezando.',
    features: ['Hasta 50 facturas/mes', '1 usuario', 'Soporte por correo'],
    highlighted: false,
  },
  {
    name: 'Negocio',
    price: '$29',
    period: '/mes',
    desc: 'Para negocios en crecimiento con más volumen de facturación.',
    features: ['Facturas ilimitadas', 'Hasta 5 usuarios', 'Integración contable', 'Soporte prioritario'],
    highlighted: true,
  },
  {
    name: 'Empresa',
    price: 'A medida',
    period: '',
    desc: 'Para empresas con necesidades de facturación a gran escala.',
    features: ['Facturas ilimitadas', 'Usuarios ilimitados', 'Integración vía API', 'Gerente de cuenta'],
    highlighted: false,
  },
]

function Landing() {
  return (
    <div className="landing">
      <header className="landing-header">
        <div className="landing-container header-inner">
          <div className="brand">
            <span className="brand-mark">F</span>
            <span className="brand-name">Facturia</span>
          </div>
          <nav className="landing-nav">
            <a href="#features">Características</a>
            <a href="#how-it-works">Cómo funciona</a>
            <a href="#pricing">Precios</a>
          </nav>
          <div className="header-actions">
            <Link to="/login" className="btn btn-ghost">Iniciar sesión</Link>
            <Link to="/login" className="btn btn-primary">Comenzar gratis</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="landing-container hero-inner">
            <span className="eyebrow">Facturación electrónica</span>
            <h1>Factura electrónica simple, rápida y 100% legal</h1>
            <p className="hero-subtitle">
              Emite, envía y controla tus comprobantes electrónicos desde un solo lugar.
              Sin instalaciones, sin complicaciones, cumpliendo siempre con la normativa vigente.
            </p>
            <div className="hero-actions">
              <Link to="/login" className="btn btn-primary btn-lg">Comenzar gratis</Link>
              <a href="#features" className="btn btn-outline btn-lg">Ver características</a>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <strong>+10,000</strong>
                <span>Facturas emitidas al mes</span>
              </div>
              <div className="stat">
                <strong>99.9%</strong>
                <span>Disponibilidad del servicio</span>
              </div>
              <div className="stat">
                <strong>&lt; 2s</strong>
                <span>Tiempo promedio de emisión</span>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="features">
          <div className="landing-container">
            <div className="section-heading">
              <span className="eyebrow">Características</span>
              <h2>Todo lo que necesitas para facturar sin fricción</h2>
            </div>
            <div className="features-grid">
              {FEATURES.map((f) => (
                <div className="feature-card" key={f.title}>
                  <div className="feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="how-it-works">
          <div className="landing-container">
            <div className="section-heading">
              <span className="eyebrow">Cómo funciona</span>
              <h2>Factura en tres simples pasos</h2>
            </div>
            <div className="steps">
              {STEPS.map((s) => (
                <div className="step" key={s.number}>
                  <div className="step-number">{s.number}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="pricing">
          <div className="landing-container">
            <div className="section-heading">
              <span className="eyebrow">Precios</span>
              <h2>Un plan para cada etapa de tu negocio</h2>
            </div>
            <div className="pricing-grid">
              {PLANS.map((plan) => (
                <div className={`plan-card ${plan.highlighted ? 'plan-highlighted' : ''}`} key={plan.name}>
                  {plan.highlighted && <span className="plan-badge">Más popular</span>}
                  <h3>{plan.name}</h3>
                  <p className="plan-desc">{plan.desc}</p>
                  <div className="plan-price">
                    <span className="price">{plan.price}</span>
                    <span className="period">{plan.period}</span>
                  </div>
                  <ul className="plan-features">
                    {plan.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <Link
                    to="/login"
                    className={`btn ${plan.highlighted ? 'btn-primary' : 'btn-outline'} btn-block`}
                  >
                    Elegir plan
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="landing-container cta-inner">
            <h2>Empieza a facturar electrónicamente hoy</h2>
            <p>Crea tu cuenta gratis, sin tarjeta de crédito.</p>
            <Link to="/login" className="btn btn-primary btn-lg">Comenzar gratis</Link>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-container footer-inner">
          <div className="brand">
            <span className="brand-mark">F</span>
            <span className="brand-name">Facturia</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Facturia. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
