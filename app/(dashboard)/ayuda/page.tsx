export default function AyudaPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gj-text mb-2">
          Guía de Uso
        </h1>
        <p className="text-gj-secondary text-sm">
          Instrucciones para usar GoJulito paso a paso. Expandí cada sección para ver los detalles.
        </p>
      </div>

      {/* Dashboard */}
      <details className="group bg-gj-card rounded-xl border border-gj-surface-high overflow-hidden">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none hover:bg-gj-surface-high/30 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-xl">📊</span>
            <span className="text-lg font-display font-semibold text-gj-text">Dashboard</span>
          </div>
          <span className="text-gj-secondary text-sm group-open:rotate-180 transition-transform duration-200">▼</span>
        </summary>
        <div className="px-6 pb-6 pt-0">
          <div className="border-t border-gj-surface-high pt-4 space-y-3">
            <p className="text-sm text-gj-secondary leading-relaxed">
              La pantalla principal resume el estado del negocio con métricas y acciones rápidas.
            </p>
            <ul className="list-disc list-inside text-sm text-gj-secondary leading-relaxed space-y-1">
              <li><span className="text-gj-text">4 métricas</span>: Clientes activos, Visas en proceso, Deudas pendientes y Turnos esta semana</li>
              <li><span className="text-gj-text">Acciones rápidas</span>: botones para crear nuevo cliente, trámite o pago sin ir al menú</li>
              <li><span className="text-gj-text">Chart semanal</span>: muestra la actividad (clientes, pagos) de los últimos 7 días</li>
              <li><span className="text-gj-text">Próximo seminario</span>: el seminario más cercano con fecha, modalidad y cupos</li>
            </ul>
            <p className="text-xs text-gj-amber mt-2">
              💡 Tip: usá las acciones rápidas para registrar pagos o clientes sin salir del dashboard.
            </p>
          </div>
        </div>
      </details>

      {/* Trámites */}
      <details className="group bg-gj-card rounded-xl border border-gj-surface-high overflow-hidden">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none hover:bg-gj-surface-high/30 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-xl">📋</span>
            <span className="text-lg font-display font-semibold text-gj-text">Trámites</span>
          </div>
          <span className="text-gj-secondary text-sm group-open:rotate-180 transition-transform duration-200">▼</span>
        </summary>
        <div className="px-6 pb-6 pt-0">
          <div className="border-t border-gj-surface-high pt-4 space-y-3">
            <p className="text-sm text-gj-secondary leading-relaxed">
              Gestión centralizada de todas las visas en proceso.
            </p>
            <ul className="list-disc list-inside text-sm text-gj-secondary leading-relaxed space-y-1">
              <li><span className="text-gj-text">Tabla de visas</span>: listado de todos los trámites activos con estado y progreso</li>
              <li><span className="text-gj-text">Búsqueda</span>: filtrá por nombre del cliente o ID del trámite (ej: VISA-0012)</li>
              <li><span className="text-gj-text">Progress badges</span>: DS-160, Pago, Cita y Embajada — indican qué pasos están completos</li>
              <li><span className="text-gj-text">Nuevo trámite</span>: wizard de 4 pasos — datos, tipo de visa, documentación y resumen</li>
            </ul>
            <p className="text-xs text-gj-amber mt-2">
              💡 Tip: los badges de progreso se actualizan desde el detalle del trámite, no desde la tabla.
            </p>
          </div>
        </div>
      </details>

      {/* Clientes */}
      <details className="group bg-gj-card rounded-xl border border-gj-surface-high overflow-hidden">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none hover:bg-gj-surface-high/30 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-xl">👥</span>
            <span className="text-lg font-display font-semibold text-gj-text">Clientes</span>
          </div>
          <span className="text-gj-secondary text-sm group-open:rotate-180 transition-transform duration-200">▼</span>
        </summary>
        <div className="px-6 pb-6 pt-0">
          <div className="border-t border-gj-surface-high pt-4 space-y-3">
            <p className="text-sm text-gj-secondary leading-relaxed">
              Base de datos de todos los clientes con vista detallada y acciones en lote.
            </p>
            <ul className="list-disc list-inside text-sm text-gj-secondary leading-relaxed space-y-1">
              <li><span className="text-gj-text">Filtros por estado</span>: PROSPECTO, ACTIVO, FINALIZADO, INACTIVO</li>
              <li><span className="text-gj-text">Búsqueda</span>: por nombre, teléfono o ID (ej: GJ-0034)</li>
              <li><span className="text-gj-text">Acciones en lote</span>: seleccioná varios clientes para cambiar estado o eliminar</li>
              <li><span className="text-gj-text">Detalle del cliente</span>: datos personales, visas asociadas, historial de pagos y auditoría</li>
            </ul>
            <p className="text-xs text-gj-amber mt-2">
              💡 Tip: nunca se elimina un cliente — se marca como INACTIVO para mantener el historial.
            </p>
          </div>
        </div>
      </details>

      {/* Pagos */}
      <details className="group bg-gj-card rounded-xl border border-gj-surface-high overflow-hidden">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none hover:bg-gj-surface-high/30 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-xl">💰</span>
            <span className="text-lg font-display font-semibold text-gj-text">Pagos</span>
          </div>
          <span className="text-gj-secondary text-sm group-open:rotate-180 transition-transform duration-200">▼</span>
        </summary>
        <div className="px-6 pb-6 pt-0">
          <div className="border-t border-gj-surface-high pt-4 space-y-3">
            <p className="text-sm text-gj-secondary leading-relaxed">
              Registro y seguimiento de todos los pagos, ya sea por visa o seminario.
            </p>
            <ul className="list-disc list-inside text-sm text-gj-secondary leading-relaxed space-y-1">
              <li><span className="text-gj-green">PAGADO</span> (verde): el pago fue recibido en su totalidad</li>
              <li><span className="text-gj-red">DEUDA</span> (rojo): hay un monto pendiente de cobro</li>
              <li><span className="text-gj-secondary">PENDIENTE</span> (gris): pago acordado pero aún no recibido</li>
              <li><span className="text-gj-text">Pago parcial</span>: ingresá un monto menor al total — el sistema calcula el remanente y lo archiva como PENDIENTE</li>
            </ul>
            <p className="text-xs text-gj-amber mt-2">
              💡 Tip: cada pago queda vinculado a un trámite o seminario para mantener el historial ordenado.
            </p>
          </div>
        </div>
      </details>

      {/* Seminarios */}
      <details className="group bg-gj-card rounded-xl border border-gj-surface-high overflow-hidden">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none hover:bg-gj-surface-high/30 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-xl">🎓</span>
            <span className="text-lg font-display font-semibold text-gj-text">Seminarios</span>
          </div>
          <span className="text-gj-secondary text-sm group-open:rotate-180 transition-transform duration-200">▼</span>
        </summary>
        <div className="px-6 pb-6 pt-0">
          <div className="border-t border-gj-surface-high pt-4 space-y-3">
            <p className="text-sm text-gj-secondary leading-relaxed">
              Creación y gestión de seminarios presenciales o virtuales.
            </p>
            <ul className="list-disc list-inside text-sm text-gj-secondary leading-relaxed space-y-1">
              <li><span className="text-gj-text">Modalidades</span>: PRESENCIAL o VIRTUAL, con capacidad y precio configurable</li>
              <li><span className="text-gj-text">Asistentes</span>: agregá, editá y gestioná quiénes participaron en cada seminario</li>
              <li><span className="text-gj-text">Conversión a visa</span>: marcá qué asistentes luego contrataron un trámite de visa</li>
              <li><span className="text-gj-text">Visibilidad</span>: los seminarios inactivos no aparecen en el dashboard ni en el calendario</li>
            </ul>
            <p className="text-xs text-gj-amber mt-2">
              💡 Tip: la conversión a visa es clave para medir el ROI de cada seminario.
            </p>
          </div>
        </div>
      </details>

      {/* Calendario */}
      <details className="group bg-gj-card rounded-xl border border-gj-surface-high overflow-hidden">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none hover:bg-gj-surface-high/30 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-xl">📅</span>
            <span className="text-lg font-display font-semibold text-gj-text">Calendario</span>
          </div>
          <span className="text-gj-secondary text-sm group-open:rotate-180 transition-transform duration-200">▼</span>
        </summary>
        <div className="px-6 pb-6 pt-0">
          <div className="border-t border-gj-surface-high pt-4 space-y-3">
            <p className="text-sm text-gj-secondary leading-relaxed">
              Vista mensual de todos los eventos agendados: turnos, pagos y seminarios.
            </p>
            <ul className="list-disc list-inside text-sm text-gj-secondary leading-relaxed space-y-1">
              <li><span className="text-gj-blue">Azul</span>: turnos de embajada agendados</li>
              <li><span className="text-gj-green">Verde / Rojo</span>: pagos (PAGADO o DEUDA)</li>
              <li><span className="text-gj-text" style={{ color: '#a855f7' }}>Violeta</span>: seminarios programados</li>
              <li><span className="text-gj-text">Popup de detalle</span>: hacé click en cualquier chip para ver la información completa del evento</li>
              <li><span className="text-gj-text">Límite visual</span>: máximo 2 chips por celda — el indicador &quot;+X más&quot; muestra cuántos eventos adicionales hay ese día</li>
            </ul>
            <p className="text-xs text-gj-amber mt-2">
              💡 Tip: usá el calendario para detectar semanas sobrecargadas de turnos y distribuir mejor los trámites.
            </p>
          </div>
        </div>
      </details>

      {/* Configuración */}
      <details className="group bg-gj-card rounded-xl border border-gj-surface-high overflow-hidden">
        <summary className="flex items-center justify-between p-6 cursor-pointer list-none select-none hover:bg-gj-surface-high/30 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚙️</span>
            <span className="text-lg font-display font-semibold text-gj-text">
              Configuración <span className="text-xs font-sans font-normal text-gj-amber ml-2">(solo admin)</span>
            </span>
          </div>
          <span className="text-gj-secondary text-sm group-open:rotate-180 transition-transform duration-200">▼</span>
        </summary>
        <div className="px-6 pb-6 pt-0">
          <div className="border-t border-gj-surface-high pt-4 space-y-3">
            <p className="text-sm text-gj-secondary leading-relaxed">
              Panel exclusivo para el administrador. Los colaboradores no tienen acceso a esta sección.
            </p>
            <ul className="list-disc list-inside text-sm text-gj-secondary leading-relaxed space-y-1">
              <li><span className="text-gj-text">Gestión de usuarios</span>: crear colaboradores, editar datos y activar/desactivar accesos</li>
              <li><span className="text-gj-text">Precios</span>: definí el precio base de visa y seminario — se usa como referencia al crear pagos</li>
              <li><span className="text-gj-text">Grupos familiares</span>: asociá clientes en un mismo grupo para gestionar trámites relacionados</li>
            </ul>
            <p className="text-xs text-gj-amber mt-2">
              💡 Tip: actualizá los precios en Configuración antes de empezar a registrar pagos nuevos cada ciclo.
            </p>
          </div>
        </div>
      </details>

      {/* Footer note */}
      <div className="pt-4 pb-2 text-center">
        <p className="text-xs text-gj-secondary">
          ¿Encontraste algo que no funciona como esperabas? Contactá al administrador del sistema.
        </p>
      </div>
    </div>
  )
}
