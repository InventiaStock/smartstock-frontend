const {
  fail,
  findProduct,
  findSensor,
  sensorStatus,
  toUnits,
  nowIso,
  inRange,
} = require('../lib/helpers');

const { notify } = require('../lib/alert-rules');

const minutesSince = (iso) =>
  iso
    ? Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 60000))
    : null;

const view = (db, a) => {
  const p = findProduct(db, a.productoId);
  const sensor = p && p.sensorId ? findSensor(db, p.sensorId) : null;
  const online = sensor && sensorStatus(sensor) === 'online';

  return {
    ...a,
    productoNombre: p ? p.nombre : '',
    umbralMinimo: p ? p.umbralMinimo : null,
    stockActual: p ? p.stockRegistrado : null,
    minutosDesdeLectura: online
      ? minutesSince(sensor.ultimaLecturaAt)
      : null,
    unidadesSensor: online
      ? toUnits(sensor.pesoKg, p.pesoUnitario)
      : null,
  };
};

module.exports = (server, db) => {
  server.get('/alertas', (req, res) => {
    const limite = Date.now() - 24 * 60 * 60 * 1000;

    const list = db.get('alertas').value()
      .filter((a) =>
        a.estado === 'ACTIVE' ||
        (a.resueltaEn && Date.parse(a.resueltaEn) >= limite)
      )
      .sort((a, b) => b.id - a.id);

    res.json(list.map((a) => view(db, a)));
  });

  server.post('/notificaciones/stock-bajo', (req, res) => {
    const { productoId } = req.body || {};

    const alerta = db.get('alertas')
      .find((a) =>
        Number(a.productoId) === Number(productoId) &&
        a.estado === 'ACTIVE'
      )
      .value();

    if (!alerta) return fail(res, 404, 'ALERT_NOT_FOUND');

    notify(db, alerta);
    res.status(202).json({ sent: true, at: nowIso() });
  });

  server.put('/canales-notificacion', (req, res) => {
    const changes = Array.isArray(req.body) ? req.body : [];
    const canales = db.get('canales-notificacion').value();

    const next = canales.map((c) => {
      const change = changes.find((x) => Number(x.id) === Number(c.id));
      return change ? !!change.activo : c.activo;
    });

    if (!next.some(Boolean)) {
      return fail(res, 422, 'AT_LEAST_ONE_CHANNEL');
    }

    canales.forEach((c, i) => {
      c.activo = next[i];
    });

    res.json(canales);
  });

  server.get('/movimientos-stock', (req, res) => {
    const { desde, hasta } = req.query;

    const list = db.get('movimientos-stock').value()
      .filter((m) => inRange(m.fecha, desde, hasta))
      .sort((a, b) => b.id - a.id)
      .map((m) => ({
        ...m,
        productoNombre: (findProduct(db, m.productoId) || {}).nombre || '',
      }));

    res.json(list);
  });
};