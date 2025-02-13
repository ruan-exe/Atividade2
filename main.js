const express = require('express');
const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(express.json());

app.post('/clientes', async (req, res) => {
    const { nome, cpf, telefone, cep, numero} = req.body;
    try {

        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const endereco = response.data;

        if (endereco.erro) {
            return res.status(400).json({ error: 'Erro ao buscar CEP' });
        }

        const cliente = await prisma.cliente.create({
            data: {
                nome,
                cpf,
                telefone,
                cep,
                numero,
                complemento: endereco.complemento,
                logradouro: endereco.logradouro,
                bairro: endereco.bairro,
                cidade: endereco.localidade,
                estado: endereco.uf,
            },
        });
        res.status(201).json(cliente);
    } catch (error) {
        res.status(500).json({  error: 'Houve um erro ao criar este cliente'});
    }
});

app.get('/clientes' , async (req, res) => {
    try {
        const cliente = await prisma.cliente.findMany();
        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ error: 'Houve um erro ao obter lista de clientes'});
    }
});

app.get('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const cliente = await prisma.cliente.findUnique({
            where: { id: parseInt(id) },
        });
        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).json({ error: 'Cliente não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Houve um erro ao obter este cliente'});
    }
})

app.put('/cliente/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, cpf, telefone, cep, numero, complemento } = req.body;
    
    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const endereco = response.data;

        if (endereco.erro) {
            return res.status(400).json({ error: 'Este CEP não é válido' });
        }

        const cliente = await prisma.cliente.update({
            where: { id: parseInt(id) },
            data: { 
                nome, 
                cpf, 
                telefone, 
                cep, 
                numero, 
                complemento: endereco.logradouro,
                logradouro: endereco.logradouro,
                bairro: endereco.bairro,
                cidade: endereco.localidade,
                estado: endereco.uf
             },
        });
        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ error: 'Houve um erro ao modificar este cliente' });
    }
});

app.delete('/cliente/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.cliente.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send();
    } catch(error) {
        res.status(500).json({ error: 'Houve um erro ao remover este cliente'});
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});