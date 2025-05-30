const express = require('express');
const router = express.Router();
const edicaoController = require('../controllers/edicaoController');

// GET /edicoes
router.get('/edicoes', async (req, res) => {
  try {
    const result = await edicaoController.getEdicoes(req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno', detalhes: err.message });
  }
});

//GET edicoes por completo, recebe todos os dados de uma edição, incluindo o vencedor e a organização, e id
router.get('/edicoes/completo', async (req, res) => {
  try {
    const result = await edicaoController.getEdicoesCompletos(req.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno', detalhes: err.message });
  }
}
);

// GET /edicoes/:id
router.get('/edicoes/:id', async (req, res) => {
  try {
    const result = await edicaoController.getEdicaoPorId(req.params.id);
    if (result) res.json(result);
    else res.status(404).json({ erro: 'Edição não encontrada' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

// GET /paises?papel=org ou GET /paises?papel=venc
router.get('/paises', async (req, res) => {
  try {
    let result;
    if (req.query.papel === 'org') {
      result = await edicaoController.getPaisesOrganizadores();
    } else if (req.query.papel === 'venc') {
      result = await edicaoController.getPaisesVencedores();
    } else {
      return res.status(400).json({ erro: 'Parâmetro papel inválido. Use "org" ou "venc".' });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

// GET /interpretes
router.get('/interpretes', async (req, res) => {
  try {
    const result = await edicaoController.getInterpretes();
    res.json(result);
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

// POST /edicoes
router.post('/edicoes', async (req, res) => {
  try {
    const result = await edicaoController.criarEdicao(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao inserir edição', detalhes: err.message });
  }
});

// DELETE /edicoes/:id
router.delete('/edicoes/:id', async (req, res) => {
  try {
    const success = await edicaoController.eliminarEdicao(req.params.id);
    if (success) res.json({ sucesso: true });
    else res.status(404).json({ erro: 'Edição não encontrada' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

// PUT /edicoes/:id
router.put('/edicoes/:id', async (req, res) => {
  try {
    const result = await edicaoController.atualizarEdicao(req.params.id, req.body);
    if (result) res.json(result);
    else res.status(404).json({ erro: 'Edição não encontrada' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar edição', detalhes: err.message });
  }
});

module.exports = router;