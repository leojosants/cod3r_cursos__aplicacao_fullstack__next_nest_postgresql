'use client'

import { urlBase } from "@/config/endpoint";
import {
  useEffect,
  useState,
} from "react";


const estilos = {
  formulario: {
    controle: "flex flex-col",
    container: "flex gap-5 items-end",
    inputs: "bg-zinc-700 p-2 rounded-md",
    botaoCriarProduto: "bg-blue-500 px-4 py-2 rounded-md",
    botaoAlterarProduto: "bg-yellow-500 px-4 py-2 rounded-md",
  },
  produtos: {
    container: "flex flex-col gap-2",
    botaoExcluir: "bg-red-500 p-2 rounded-md",
    botaoAtualizar: "bg-green-500 p-2 rounded-md",
    conteudo: "flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-md",
  },
  containerPrincipal: "flex flex-col justify-center items-center h-screen gap-10",
};

export default function Home() {
  const [produto, setProduto] = useState<any>({});
  const [produtos, setProdutos] = useState<any>([]);

  useEffect(() => {
    obterProdutos();
  }, []);

  async function obterProdutos() {
    try {
      const response = await fetch(urlBase);
      const produtos = await response.json();
      setProdutos(produtos);
    }
    catch (error) { }
  }

  async function criarProduto() {
    if (produto.nome === undefined) {
      alert('Campo "Nome" não pode ser vazio!');
      return;
    }

    if (produto.descricao === undefined) {
      alert('Campo "Descrição" não pode ser vazio!');
      return;
    }

    if (produto.preco === undefined) {
      alert('Campo "Preço" não pode ser vazio!');
      return;
    }

    if (produto.preco <= 0) {
      alert('Campo "Preço" não pode ser menor ou igual que zero!');
      return;
    }

    try {
      await fetch(urlBase,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(produto)
        }
      );
      setProduto({});
      await obterProdutos();
    }
    catch (error) { }
  }

  async function alterarProduto() {
    const confirmarAtualizacao = confirm(`Realmente deseja atualizar produto?`);
    if (!confirmarAtualizacao) {
      setProduto({});
      return;
    }

    if (produto.nome === '') {
      alert('Campo "Nome" não pode ser vazio!');
      return;
    }

    if (produto.descricao === '') {
      alert('Campo "Descrição" não pode ser vazio!');
      return;
    }

    if (produto.preco <= 0) {
      alert('Campo "Preço" não pode ser menor ou igual a zero!');
      return;
    }

    try {
      await fetch(`${urlBase}/${produto.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(produto),
        }
      );
      setProduto({});
      await obterProdutos();
    }
    catch (error) { }
  }

  async function obterProdutosPorId(id: number) {
    try {
      const response = await fetch(`${urlBase}/${id}`);
      const produto = await response.json();
      setProduto(produto);
    }
    catch (error) { }
  }

  async function excluirProduto(id: number) {
    const confirmarExclusao = confirm(`Realmente deseja deletar produto?`);
    if (!confirmarExclusao) return;

    try {
      await fetch(`${urlBase}/${id}`,
        { method: 'DELETE' }
      );
      await obterProdutos();
    }
    catch (error) { }
  }

  function renderizarFormProduto() {
    return (
      <div className={estilos.formulario.container}>
        <div className={estilos.formulario.controle}>
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            type="text"
            value={produto.nome ?? ''}
            onChange={(event) => setProduto({ ...produto, nome: event.target.value })}
            className={estilos.formulario.inputs}
          />
        </div>

        <div className={estilos.formulario.controle}>
          <label htmlFor="descricao">Descrição</label>
          <input
            id="descricao"
            type="text"
            value={produto.descricao ?? ''}
            onChange={(event) => setProduto({ ...produto, descricao: event.target.value })}
            className={estilos.formulario.inputs}
          />
        </div>

        <div className={estilos.formulario.controle}>
          <label htmlFor="preco">Preço</label>
          <input
            id="preco"
            type="number"
            value={produto.preco ?? ''}
            onChange={(event) => setProduto({ ...produto, preco: +event.target.value })}
            className={estilos.formulario.inputs}
          />
        </div>

        <div>
          {
            produto.id ? (
              <button className={estilos.formulario.botaoAlterarProduto} onClick={alterarProduto}>
                Alterar Produto
              </button>
            ) : (
              <button className={estilos.formulario.botaoCriarProduto} onClick={criarProduto}>
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
      <div className={estilos.produtos.container}>
        {
          produtos.map(
            (produto: any) => (
              <div key={produto.id} className={estilos.produtos.conteudo}>
                <div className="flex-1">
                  {produto.nome}
                </div>

                <div>
                  R${produto.preco}
                </div>

                <button className={estilos.produtos.botaoAtualizar} onClick={() => obterProdutosPorId(produto.id)}>
                  Atualizar
                </button>

                <button className={estilos.produtos.botaoExcluir} onClick={() => excluirProduto(produto.id)}>
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
    <div className={estilos.containerPrincipal}>
      {renderizarFormProduto()}
      {renderizarProdutos()}
    </div>
  );
}
