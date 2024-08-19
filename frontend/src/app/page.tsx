'use client'

import { useEffect, useState } from "react";

export default function Home() {
  const [produto, setProduto] = useState<any>({});
  const [produtos, setProdutos] = useState<any>([]);

  useEffect(() => { obterProdutos() }, []);

  async function obterProdutos() {
    const response = await fetch('http://localhost:3001/produtos');
    const produtos = await response.json();
    setProdutos(produtos);
  }

  async function criarProduto() {
    if (produto.nome === undefined) {
      alert();
      return;
    }

    if (produto.descricao === undefined) {
      alert();
      return;
    }

    if (produto.preco === undefined) {
      alert();
      return;
    }

    await fetch('http://localhost:3001/produtos',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto)
      }
    );
    setProduto({});
    await obterProdutos();
  }

  async function alterarProduto() {
    await fetch(`http://localhost:3001/produtos/${produto.id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      }
    );
    setProduto({});
    await obterProdutos();
  }

  async function obterProdutosPorId(id: number) {
    const response = await fetch(`http://localhost:3001/produtos/${id}`);
    const produto = await response.json();
    setProduto(produto);
  }

  async function excluirProduto(id: number) {
    await fetch(`http://localhost:3001/produtos/${id}`,
      { method: 'DELETE' }
    );
    await obterProdutos();
  }

  function renderizarFormProduto() {
    return (
      <div className="flex gap-5 items-end">
        <div className="flex flex-col">
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            type="text"
            value={produto.nome ?? ''}
            onChange={(event) => setProduto({ ...produto, nome: event.target.value })}
            className="bg-zinc-700 p-2 rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="descricao">Descrição</label>
          <input
            id="descricao"
            type="text"
            value={produto.descricao ?? ''}
            onChange={(event) => setProduto({ ...produto, descricao: event.target.value })}
            className="bg-zinc-700 p-2 rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="preco">Preço</label>
          <input
            id="preco"
            type="number"
            value={produto.preco ?? ''}
            onChange={(event) => setProduto({ ...produto, preco: +event.target.value })}
            className="bg-zinc-700 p-2 rounded-md"
          />
        </div>

        <div>
          {
            produto.id ? (
              <button className="bg-yellow-500 px-4 py-2 rounded-md" onClick={alterarProduto}>
                Alterar Produto
              </button>
            ) : (
              <button className="bg-blue-500 px-4 py-2 rounded-md" onClick={criarProduto}>
                Criar Produto
              </button>
            )
          }
        </div>
      </div>
    );
  }

  function renderizarProdutos() {
    return (
      <div className="flex flex-col gap-2">
        {
          produtos.map(
            (produto: any) => (
              <div key={produto.id} className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-md">
                <div className="flex-1">
                  {produto.nome}
                </div>

                <div>
                  R${produto.preco}
                </div>

                <button className="bg-green-500 p-2 rounded-md" onClick={() => obterProdutosPorId(produto.id)}>
                  Atualizar
                </button>

                <button className="bg-red-500 p-2 rounded-md" onClick={() => excluirProduto(produto.id)}>
                  Excluir
                </button>
              </div>
            )
          )
        }
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-10 flex-wrap">
      {renderizarFormProduto()}
      {renderizarProdutos()}
    </div>
  );
}
