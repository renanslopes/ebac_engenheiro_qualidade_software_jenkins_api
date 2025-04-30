/// <reference types = "cypress"/>
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

  let token
  before(() => {
    cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
  });

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return contrato.validateAsync(response.body)
    })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).then((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
    })
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    let usuario = `Usuario Teste ${Math.floor(Math.random() * 1000)}`
    let email = `email_teste_${Math.floor(Math.random() * 100)}@teste.com`
    cy.cadastrarUsuario(token, usuario, email, "123456", "true")
      .then((response) => {
        expect(response.status).to.equal(201)
        expect(response.body.message).to.equal('Cadastro realizado com sucesso')
      })
  });

  it('Deve validar um usuário com email inválido', () => {
    let usuario = `Usuario Teste ${Math.floor(Math.random() * 1000)}`
    cy.cadastrarUsuario(token, usuario, "teste@teste.com", "123456", "true")
      .then((response) => {
        expect(response.status).to.equal(400)
        expect(response.body.message).to.equal('Este email já está sendo usado')
      },
      )
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    let nome = `Usuario EBAC ${Math.floor(Math.random() * 100)}`
    let email = `email_teste_${Math.floor(Math.random() * 100)}@teste.com`
    cy.cadastrarUsuario(token, nome, email, "123456", "false")
      .then(response => {
        let id = response.body._id

        cy.request({
          method: 'PUT',
          url: `usuarios/${id}`,
          headers: { authorization: token },
          body:
          {
            "nome": nome,
            "email": email,
            "password": "maionese1",
            "administrador": "false"
          }
        }).then(response => {
          expect(response.body.message).to.equal('Registro alterado com sucesso')
        })
      })
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    let nome = `Usuario EBAC ${Math.floor(Math.random() * 100)}`
    let email = `email_teste_${Math.floor(Math.random() * 100)}@teste.com`
    cy.cadastrarUsuario(token, nome, email, "123456", "false")
      .then(response => {
        let id = response.body._id

        cy.request({
          method: 'DELETE',
          url: `usuarios/${id}`,
          headers: { authorization: token },
          // body:
          // {
          //   "nome": nome,
          //   "email": email,
          //   "password": "maionese1",
          //   "administrador": "false"
          // }
        }).then(response => {
          expect(response.body.message).to.equal('Registro excluído com sucesso')
        })
      })
  });


});


