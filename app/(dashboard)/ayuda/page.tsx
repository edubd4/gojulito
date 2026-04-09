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
              La pantalla principal resume el estado del negocio con métricas clave y alertas de deudas próximas.
            </p>
            <ul className="list-disc list-inside text-sm text-gj-secondary leading-relaxed space-y-1">
              <li><span className="text-gj-text">Trámites activos</span>: visas en proceso, con turno asignado y entregadas — con barra de actividad semanal</li>
              <li><span className="text-gj-text">Actividad semanal</span>: hacé click en cualquier barra para ver los eventos de ese día (pagos, cambios de estado, notas)</li>
              <li><span className="text-gj-text">Próximas citas</span>: turnos de embajada agendados para los próximos días</li>
              <li><span className="text-gj-text">Próximo seminario</span>: el seminario más cercano con fecha, modalidad y cupos disponibles</li>
              <li><span className="text-gj-text">Deudas próximas</span>: pagos en DEUDA con vencimiento en los próximos 30 días</li>
            </ul>
            <p className="text-xs text-gj-amber mt-2">
              💡 Tip: el chart semanal es interactivo — hacé click en el día para ver qué se registró.
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
              <li><span className="text-gj-text">Filtros de métricas</span>: hacé click en las métricas superiores para filtrar por estado</li>
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
              Base de datos de todos los clientes con vista detallada e historial completo.
            </p>
            <ul className="list-disc list-inside text-sm text-gj-secondary leading-relaxed space-y-1">
              <li><span className="text-gj-text">Filtros por estado</span>: PROSPECTO, ACTIVO, FINALIZADO, INACTIVO</li>
              <li><span className="text-gj-text">Búsqueda</span>: por nombre, teléfono o ID (ej: GJ-0034)</li>
              <li><span className="text-gj-text">Detalle del cliente</span>: datos personales, visas asociadas, historial de pagos y auditoría</li>
              <li><span className="text-gj-text">Marcar como inactivo</span>: el botón de papelera no elimina — desactiva al cliente conservando todos sus datos</li>
            </ul>
            <p className="text-xs text-gj-amber mt-2">
              💡 Tip: nunca se elimina un cliente — se marca como INACTIVO para mantener el historial completo.
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
              <li><span className="text-gj-red">DEUDA</span> (rojo): hay un monto pendiente de cobro, con fecha de vencimiento</li>
              <li><span className="text-gj-secondary">PENDIENTE</span> (gris): pago acordado pero aún no recibido</li>
              <li><span className="text-gj-text">Pago parcial</span>: al registrar un nuevo pago, el sistema detecta deudas existentes y calcula el remanente automáticamente — podés archivar la diferencia como PENDIENTE</li>
              <li><span className="text-gj-text">Cambio de estado</span>: usá el dropdown de estado en la tabla para actualizar pagos individualmente</li>
            </ul>
            <p className="text-xs text-gj-amber mt-2">
              💡 Tip: cada pago queda vinculado al trámite o seminario para mantener el historial ordenado.
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
              <li><span className="text-gj-text">Próximos seminarios</span>: cards con capacidad disponible, fecha y modalidad</li>
              <li><span className="text-gj-text">Historial</span>: seminarios pasados (fecha anterior a hoy) — podés archivarlos con el botón &quot;Archivar&quot;</li>
              <li><span className="text-gj-text">Asistentes</span>: agregá y gestioná quiénes participaron en cada seminario</li>
              <li><span className="text-gj-text">Conversión a visa</span>: marcá qué asistentes luego contrataron un trámite — clave para medir el ROI</li>
              <li><span className="text-gj-text">Archivar</span>: los seminarios archivados dejan de aparecer en el historial visible</li>
            </ul>
            <p className="text-xs text-gj-amber mt-2">
              💡 Tip: la conversión a visa te permite medir cuántos asistentes terminan siendo clientes.
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
              <li><span className="text-gj-text">Precios</span>: precio base de visa y seminario — se usa como referencia al crear pagos nuevos</li>
              <li><span className="text-gj-text">Grupos familiares</span>: asociá clientes en un mismo grupo para gestionar trámites relacionados</li>
            </ul>
            <p className="text-xs text-gj-amber mt-2">
              💡 Tip: actualizá los precios en Configuración antes de empezar cada ciclo de pagos nuevo.
            </p>
          </div>
        </div>
      </details>

      {/* FAQ */}
      <div className="mt-8 mb-2">
        <h2 className="text-lg font-display font-bold text-gj-text mb-4">Preguntas frecuentes</h2>
        <div className="space-y-3">

          <details className="group bg-gj-surface-low rounded-xl border border-gj-outline/20 overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none select-none hover:bg-gj-surface-mid/50 transition-colors">
              <span className="text-sm font-medium text-gj-text">¿Se puede eliminar un cliente o trámite?</span>
              <span className="text-gj-secondary text-xs group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <div className="px-5 pb-4 pt-0 border-t border-gj-outline/10">
              <p className="text-sm text-gj-secondary leading-relaxed">
                No. GoJulito usa <strong className="text-gj-text">soft-delete</strong>: los clientes se marcan como INACTIVO y los seminarios se archivan, pero los datos nunca se borran. Esto garantiza el historial completo y evita pérdidas accidentales.
              </p>
            </div>
          </details>

          <details className="group bg-gj-surface-low rounded-xl border border-gj-outline/20 overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none select-none hover:bg-gj-surface-mid/50 transition-colors">
              <span className="text-sm font-medium text-gj-text">¿Cómo registro un pago parcial?</span>
              <span className="text-gj-secondary text-xs group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <div className="px-5 pb-4 pt-0 border-t border-gj-outline/10">
              <p className="text-sm text-gj-secondary leading-relaxed">
                Andá a Pagos → <strong className="text-gj-text">Nuevo Pago</strong>. Al seleccionar un cliente con deuda existente, el sistema muestra automáticamente el panel de resolución con el total adeudado. Ingresá el monto que pagó — si es menor, podés marcar <em>Archivar remanente como PENDIENTE</em> para guardar la diferencia como pago pendiente.
              </p>
            </div>
          </details>

          <details className="group bg-gj-surface-low rounded-xl border border-gj-outline/20 overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none select-none hover:bg-gj-surface-mid/50 transition-colors">
              <span className="text-sm font-medium text-gj-text">¿Por qué no aparece un seminario en el dashboard?</span>
              <span className="text-gj-secondary text-xs group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <div className="px-5 pb-4 pt-0 border-t border-gj-outline/10">
              <p className="text-sm text-gj-secondary leading-relaxed">
                El widget "Próximo Seminario" solo muestra seminarios activos con fecha futura. Si un seminario está archivado (inactivo) o ya pasó su fecha, no aparece. Verificá en la sección Seminarios que esté activo y con fecha correcta.
              </p>
            </div>
          </details>

          <details className="group bg-gj-surface-low rounded-xl border border-gj-outline/20 overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none select-none hover:bg-gj-surface-mid/50 transition-colors">
              <span className="text-sm font-medium text-gj-text">¿Qué es el historial y por qué no se puede editar?</span>
              <span className="text-gj-secondary text-xs group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <div className="px-5 pb-4 pt-0 border-t border-gj-outline/10">
              <p className="text-sm text-gj-secondary leading-relaxed">
                El historial es un <strong className="text-gj-text">registro de auditoría inmutable</strong>. Cada cambio de estado, pago o nota queda registrado con fecha, hora y quién lo realizó. No se puede editar ni borrar para garantizar la trazabilidad completa de cada cliente.
              </p>
            </div>
          </details>

          <details className="group bg-gj-surface-low rounded-xl border border-gj-outline/20 overflow-hidden">
            <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none select-none hover:bg-gj-surface-mid/50 transition-colors">
              <span className="text-sm font-medium text-gj-text">¿Cómo sé si el bot de Telegram está funcionando?</span>
              <span className="text-gj-secondary text-xs group-open:rotate-180 transition-transform duration-200">▼</span>
            </summary>
            <div className="px-5 pb-4 pt-0 border-t border-gj-outline/10">
              <p className="text-sm text-gj-secondary leading-relaxed">
                El bot envía notificaciones automáticas cuando se registra un nuevo cliente o se actualiza el estado de una visa. Si no llegan mensajes, verificá con el administrador del sistema que el servicio n8n esté activo en el servidor.
              </p>
            </div>
          </details>

        </div>
      </div>

      {/* Footer note */}
      <div className="pt-2 pb-4 text-center">
        <p className="text-xs text-gj-secondary">
          GoJulito v1.6 · Sistema operativo de Julio Correa · Tucumán, Argentina
        </p>
      </div>
    </div>
  )
}
