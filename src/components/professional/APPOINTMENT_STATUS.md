# Status de Agendamento no ServiConnect

O sistema de agendamento do ServiConnect utiliza os seguintes status para rastrear e gerenciar o ciclo de vida de um agendamento:

## 1. PENDING (Pendente)
- **Descrição**: O agendamento foi criado, mas ainda não foi confirmado pelo profissional ou pelo administrador.
- **Quando usado**: Quando um cliente faz um novo agendamento.
- **Transições permitidas**: 
  - Pode ser confirmado pelo profissional ou administrador (→ CONFIRMED)
  - Pode ser cancelado pelo cliente, profissional ou administrador (→ CANCELLED)
  - Pode ser marcado como não comparecimento (→ NO_SHOW)

## 2. CONFIRMED (Confirmado)
- **Descrição**: O agendamento foi aceito pelo profissional ou administrador.
- **Quando usado**: Após revisão do agendamento pendente.
- **Transições permitidas**:
  - Pode ser iniciado quando o cliente chega para o serviço (→ IN_PROGRESS)
  - Pode ser cancelado com antecedência mínima de 2 horas (→ CANCELLED)
  - Pode ser marcado como não comparecimento se o cliente não aparecer (→ NO_SHOW)
  - Pode ser marcado como concluído (→ COMPLETED)

## 3. IN_PROGRESS (Em Andamento)
- **Descrição**: O serviço está sendo executado neste momento.
- **Quando usado**: Quando o cliente chega e o serviço começa.
- **Transições permitidas**:
  - Pode ser marcado como concluído quando o serviço termina (→ COMPLETED)

## 4. COMPLETED (Concluído)
- **Descrição**: O serviço foi realizado com sucesso.
- **Quando usado**: Quando o profissional finaliza o serviço.
- **Características**:
  - Este é um estado final.
  - Gera eventos de gamificação para o cliente.
  - Permite que o cliente avalie o serviço posteriormente.

## 5. CANCELLED (Cancelado)
- **Descrição**: O agendamento foi cancelado.
- **Quando usado**: 
  - Quando o cliente cancela o agendamento (necessita de pelo menos 2 horas de antecedência).
  - Quando o profissional ou administrador cancela o agendamento.
- **Características**:
  - Este é um estado final para o fluxo normal.
  - Em casos excepcionais, um administrador pode reverter para PENDING.

## 6. NO_SHOW (Não Compareceu)
- **Descrição**: O cliente não compareceu ao agendamento.
- **Quando usado**: Quando o horário do agendamento passa e o cliente não apareceu.
- **Características**:
  - Este é um estado final.
  - Apenas administradores e profissionais podem marcar um agendamento como NO_SHOW.

## Regras de Transição de Status

- Apenas profissionais e administradores podem confirmar agendamentos.
- Apenas profissionais e administradores podem marcar um agendamento como concluído ou em andamento.
- Clientes só podem cancelar agendamentos com pelo menos 2 horas de antecedência.
- Administradores podem modificar qualquer status conforme necessário.
- Agendamentos só podem ser criados para horários futuros (pelo menos 1 hora no futuro).

## Fluxo Típico de um Agendamento

1. Cliente cria um agendamento → **PENDING**
2. Profissional ou administrador confirma → **CONFIRMED**
3. No dia do agendamento, o serviço é iniciado → **IN_PROGRESS**
4. Após a conclusão do serviço → **COMPLETED**

## Alternativas ao Fluxo Normal

- Cliente ou profissional cancela → **CANCELLED**
- Cliente não comparece → **NO_SHOW**
