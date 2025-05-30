const Edicao = require('../models/edicao');

// GET /edicoes e GET /edicoes?org=EEEE
exports.getEdicoes = async (query) => {
  const filtro = {};
  if (query.org) filtro.organizacao = query.org;
  
  const edicoes = await Edicao.find(filtro, 
    { _id: 0, ano: 1, organizacao: 1, vencedor: 1 }).lean();
  
  return edicoes.map(e => ({
    anoEdição: e.ano,
    organizador: e.organizacao,
    vencedor: e.vencedor
  }));
};

// GET /edicoes/completo
exports.getEdicoesCompletos = async (query) => {
  const filtro = {};
  if (query.org) filtro.organizacao = query.org;
  
  const edicoes = await Edicao.find(filtro, 
    { _id: 0, id: 1, ano: 1, organizacao: 1, vencedor: 1, musicas: 1 }).lean();
  
  return edicoes.map(e => ({
    id: e.id,
    anoEdição: e.ano,
    organizador: e.organizacao,
    vencedor: e.vencedor,
    musicas: e.musicas
  }));
};

// GET /edicoes/:id
exports.getEdicaoPorId = async (id) => {
  return await Edicao.findOne({ id: id }, { _id: 0 });
};

// GET /paises?papel=org
exports.getPaisesOrganizadores = async () => {
  const paises = await Edicao.aggregate([
    { $match: { organizacao: { $exists: true, $ne: null } } },
    { $group: { 
        _id: "$organizacao", 
        anos: { $push: "$ano" } 
    }},
    { $sort: { _id: 1 } },
    { $project: { _id: 0, pais: "$_id", anos: 1 } }
  ]);
  
  return paises;
};

// GET /paises?papel=venc
exports.getPaisesVencedores = async () => {
  const paises = await Edicao.aggregate([
    { $match: { vencedor: { $exists: true, $ne: null } } },
    { $group: { 
        _id: "$vencedor", 
        anos: { $push: "$ano" } 
    }},
    { $sort: { _id: 1 } },
    { $project: { _id: 0, pais: "$_id", anos: 1 } }
  ]);
  
  return paises;
};

// GET /interpretes
exports.getInterpretes = async () => {
  const interpretes = await Edicao.aggregate([
    { $unwind: "$musicas" },
    { $group: { 
        _id: "$musicas.intérprete",
        pais: { $first: "$musicas.país" }
    }},
    { $match: { _id: { $ne: null } } },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, nome: "$_id", pais: 1 } }
  ]);
  
  return interpretes;
};

// POST /edicoes
exports.criarEdicao = async (data) => {
  const nova = new Edicao(data);
  return await nova.save();
};

// DELETE /edicoes/:id
exports.eliminarEdicao = async (id) => {
  const result = await Edicao.deleteOne({ id: id });
  return result.deletedCount > 0;
};

// PUT /edicoes/:id
exports.atualizarEdicao = async (id, data) => {
  return await Edicao.findOneAndUpdate(
    { id: id },
    data,
    { new: true, runValidators: true }
  );
};