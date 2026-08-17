# Araujo Freitas Advogados

Sistema web para gerenciamento de atendimentos e agendamentos de um escritório de advocacia.

O **Araujo Freitas Advogados** foi desenvolvido como uma aplicação com proposta de SaaS (Software as a Service), permitindo centralizar o gerenciamento de clientes, advogados, áreas jurídicas, agendamentos e mensagens em uma única plataforma.

A aplicação possui diferentes níveis de acesso e regras de negócio para organizar o fluxo entre clientes, advogados e administradores.

## Objetivo da aplicação

O sistema busca resolver problemas comuns de organização de escritórios de advocacia, como:

- dificuldade no gerenciamento de agendamentos;
- organização dos profissionais do escritório;
- direcionamento de clientes para advogados especializados;
- acompanhamento de solicitações de atendimento;
- gerenciamento de clientes;
- controle dos atendimentos;
- centralização das mensagens recebidas;
- acompanhamento dos dados do escritório através de indicadores.

A aplicação permite que o cliente solicite um atendimento, escolha uma área jurídica e, opcionalmente, selecione um advogado específico.

Quando o cliente não deseja escolher um profissional, o próprio escritório pode realizar a indicação de um advogado adequado para a área solicitada.

## Tipos de usuários

O sistema possui três tipos principais de usuários:

### Cliente

O cliente pode:

- criar uma conta;
- realizar login;
- visualizar seus dados;
- solicitar atendimento;
- escolher uma área jurídica;
- escolher entre receber uma indicação do escritório ou selecionar um advogado;
- escolher data e horário;
- acompanhar seus agendamentos;
- cancelar atendimentos quando permitido.


### Advogado

O advogado pode:

- realizar login;
- acessar seu painel;
- visualizar atendimentos relacionados às suas áreas de atuação;
- receber solicitações de atendimento;
- confirmar atendimentos;
- cancelar atendimentos;
- acompanhar seus compromissos.


### Administrador

O administrador possui acesso à área administrativa do sistema e pode:

- visualizar indicadores;
- gerenciar advogados;
- cadastrar novos advogados;
- editar advogados;
- remover advogados;
- cadastrar áreas de atuação;
- visualizar agendamentos;
- acompanhar usuários;
- visualizar mensagens;
- gerenciar informações do escritório.


# Como acessar o sistema

## Login como administrador

Utilize:

E-mail: admin@araujoefreitas.com
Senha: 123456


## Login como Advogado

Utilize:

E-mail: advogado<ID>@araujoefreitas.com
Senha: 123456

Os advogados existentes na aplicação inicial são:

Lucas Mendes Ribeiro
ID: 2000
E-mail: advogado2000@araujoefreitas.com
Senha: 123456

Fernanda Almeida Costa
ID: 2001
E-mail: advogado2001@araujoefreitas.com
Senha: 123456

Marcelo Henrique Souza
ID: 2002
E-mail: advogado2002@araujoefreitas.com
Senha: 123456

## Login como Cliente
E-mail: cliente@araujoefreitas.com
Senha: 123456

Regras de negócio

As regras de negócio são utilizadas para garantir que os agendamentos e relacionamentos entre clientes e advogados sejam consistentes.

# Área jurídica obrigatória

Todo atendimento precisa estar relacionado a uma área jurídica.

Exemplos:

Direito Civil;
Direito Trabalhista;
Direito Empresarial;
Direito de Família;
Direito do Consumidor;
Direito Previdenciário;
Direito Tributário;
Direito Criminal.

# Especialidade do advogado

Um advogado somente pode receber um atendimento quando sua especialidade for compatível com a área jurídica escolhida pelo cliente.

Por exemplo:

Área escolhida:
Direito de Família


Advogado:
Especialidade = Direito de Família

Nesse caso, o advogado pode receber o atendimento.

Caso o advogado não possua a especialidade selecionada, o sistema impede a atribuição.

# Escolha do advogado

O cliente possui duas opções:

Escritório indica

O sistema cria a solicitação sem um advogado específico.

Nesse caso:

lawyerId = undefined
status = pending

O escritório poderá posteriormente indicar um profissional compatível.

Escolher advogado

O cliente seleciona diretamente um advogado disponível para a área escolhida.

O sistema verifica se o profissional realmente atende aquela área antes de criar o agendamento.

# Não é permitido agendar no passado

O sistema impede a criação de atendimentos para datas anteriores ao dia atual.

Exemplo:

Hoje: 17/08/2026


Data escolhida: 16/08/2026


Resultado:
Agendamento bloqueado.
# Não é permitido agendar aos finais de semana

Os atendimentos somente podem ser agendados de segunda a sexta-feira.

Sábados e domingos são bloqueados pelo sistema.

# Horários passados

Quando o cliente escolhe a data atual, o horário também precisa ser posterior ao horário atual.

Por exemplo:

Horário atual: 14:30


14:00 → bloqueado
15:00 → permitido

Para datas futuras, os horários cadastrados podem ser utilizados normalmente.

# Conflito de horários

Um advogado não pode possuir dois atendimentos diferentes no mesmo:

Data + horário

Exemplo:

Advogado: Lucas Mendes Ribeiro
Data: 20/08/2026
Horário: 14:00

Se já existir um atendimento ativo para esse profissional nesse mesmo horário, o sistema impede um novo agendamento.

Atendimentos cancelados não são considerados conflitos.


# Estados do atendimento

Os atendimentos possuem três estados:

pending
confirmed
cancelled
Pendente

Solicitação criada, mas ainda não confirmada.

Confirmado

Atendimento aceito e associado a um advogado.

Cancelado

Atendimento cancelado.


# Remoção de advogado

Quando um advogado é removido, seus atendimentos não são apagados.

As atribuições do profissional são removidas e os atendimentos confirmados retornam para o estado pendente.

Dessa forma, o histórico do atendimento é preservado e o escritório pode indicar outro profissional.

# Alteração das especialidades

Quando as especialidades de um advogado são alteradas, os atendimentos que não forem mais compatíveis com suas novas áreas deixam de permanecer atribuídos a esse profissional.

Quando necessário, o atendimento volta para:

status = pending

permitindo que outro advogado compatível seja indicado.

# Exclusão de cliente

Quando um cliente é removido do sistema:

seus dados de usuário são removidos;
seus agendamentos são removidos;
suas mensagens relacionadas ao e-mail cadastrado são removidas.

Isso evita que informações relacionadas ao usuário permaneçam vinculadas a uma conta inexistente.

# Administrador

O administrador possui uma conta protegida pelo sistema:

E-mail:
admin@araujoefreitas.com


Senha:
123456

A conta administrativa não pode ser removida através do gerenciamento normal de usuários.

Persistência

A aplicação utiliza localStorage para manter os dados entre sessões do navegador.

Entre os dados persistidos estão:

usuários;
advogado;
agendamentos;
mensagens;
usuário atualmente autenticado.

Isso permite que os dados permaneçam disponíveis mesmo após atualizar ou fechar a página.

Dados iniciais

A aplicação possui dados iniciais para facilitar a demonstração.

Esses dados incluem:

clientes;
advogados;
mensagens;
agendamentos;
usuários administrativos;
usuários de advogados.

Os dados iniciais são gerados através do arquivo de seed da aplicação.

Tecnologias utilizadas

O projeto foi desenvolvido utilizando:

Angular;
TypeScript;
HTML;
CSS;
Angular Reactive Forms;
Angular Signals;
Angular Router;
Angular ESLint;
Prettier;
Faker.js;
localStorage.

Proposta SaaS

O sistema foi desenvolvido pensando em uma solução que poderia ser oferecida como serviço para diferentes escritórios de advocacia.

A ideia é fornecer uma plataforma que centralize:

atendimento;
clientes;
advogados;
agendamentos;
mensagens;
organização das áreas jurídicas;
indicadores administrativos.

A estrutura permite que a solução seja adaptada para diferentes escritórios que possuam necessidades semelhantes de gerenciamento.

Benefícios para o escritório

A utilização da plataforma permite:

reduzir a organização manual dos atendimentos;
centralizar informações;
facilitar o contato entre clientes e profissionais;
reduzir conflitos de horários;
direcionar atendimentos para profissionais especializados;
acompanhar o status dos atendimentos;
facilitar o gerenciamento administrativo;
visualizar indicadores do escritório em um único ambiente.

