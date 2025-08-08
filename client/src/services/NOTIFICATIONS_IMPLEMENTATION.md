# Sistema de Notificações Implementado

## 📋 Visão Geral

Foi implementado um sistema de notificações para alertar sobre entregas vencidas e coletas atrasadas, seguindo o mesmo padrão usado no sistema MedResiduos. O sistema usa o `EntityFactory` para processar os dados e calcular automaticamente os status.

## 🚨 Notificações Implementadas

### 1. **EntregasPage.jsx** - Entregas Vencidas
- **Entregas Vencidas**: Materiais que passaram da data de devolução prevista
- **Próximas ao Vencimento**: Materiais com 3 dias ou menos para devolução
- **Ações Disponíveis**: Marcar como devolvido, marcar como vencido, editar

### 2. **PainelColetasPage.jsx** - Coletas Atrasadas
- **Coletas Atrasadas**: Agendamentos que passaram da data/hora programada
- **Ações Disponíveis**: Confirmar coleta, editar

## 🔧 Funcionalidades Implementadas

### Sistema de Cores e Status

#### **Entregas**
- 🔴 **Vermelho**: Entregas vencidas (passou da data de devolução)
- 🟡 **Amarelo**: Próximas ao vencimento (3 dias ou menos)
- 🟢 **Verde**: Status "Devolvido"
- 🔵 **Azul**: Status "Aguardando Devolução"
- ⚫ **Cinza**: Status "Vencido"

#### **Coletas**
- 🔴 **Fundo Vermelho**: Coletas atrasadas
- 🟡 **Amarelo**: Status "Agendada"
- 🟢 **Verde**: Status "Realizada"
- ⚫ **Cinza**: Status "Cancelada"

### Métodos do EntityFactory Utilizados

#### **Entrega Material**
```javascript
const entrega = EntityFactory.create('entrega', dadosAPI);

// Métodos utilizados:
entrega.isVencido()              // true se passou da data de devolução
entrega.isProximoVencimento()    // true se faltam 3 dias ou menos
entrega.getDiasParaDevolucao()   // número de dias (positivo = restantes, negativo = em atraso)
entrega.getStatusColor()         // cor do status (#28a745, #ffc107, etc.)
entrega.getDataEntregaFormatada()     // data formatada (dd/mm/aaaa)
entrega.getDataDevolucaoFormatada()   // data formatada (dd/mm/aaaa)
```

#### **Agenda Coleta**
```javascript
const coleta = EntityFactory.create('agendacoleta', dadosAPI);

// Métodos utilizados:
coleta.isAtrasada()              // true se passou da data/hora agendada
coleta.getDataAgendadaFormatada()    // data/hora formatada (dd/mm/aaaa hh:mm)
coleta.getStatusColor()          // cor do status
coleta.getStatusFormatado()      // status em português (Agendada, Realizada, etc.)
```

## 📊 Layout das Notificações

### **EntregasPage.jsx**
```jsx
{/* Área de Notificações */}
{notificacoes.length > 0 && (
  <div className="notificacao-alerta">
    <FaExclamationTriangle /> Atenção: X entrega(s) requer(em) atenção!
    
    {notificacoes.map(notificacao => (
      <div className="notificacao-item">
        {/* Tipo de notificação (vencida/próxima) */}
        {/* Informações do paciente e material */}
        {/* Quantidade e datas */}
        {/* Botões de ação */}
      </div>
    ))}
  </div>
)}
```

### **PainelColetasPage.jsx**
```jsx
{/* Área de Notificações */}
{notificacoes.length > 0 && (
  <div className="notificacao-alerta">
    Atenção: Existem coletas agendadas com data já passada!
    
    {notificacoes.map(notificacao => (
      <li>
        {/* Informações da coleta */}
        {/* Data agendada */}
        {/* Paciente e parceiro */}
        {/* Botão para confirmar */}
      </li>
    ))}
  </div>
)}
```

## 🎯 Ações Disponíveis

### **Na Página de Entregas**

1. **Marcar como Devolvido**
   - Atualiza status para "Devolvido"
   - Remove da lista de notificações
   - Confirmação via SweetAlert2

2. **Marcar como Vencido**
   - Atualiza status para "Vencido"
   - Remove da lista de notificações
   - Confirmação via SweetAlert2

3. **Editar Entrega**
   - Navega para página de edição
   - Permite alterar data de devolução

### **Na Página de Coletas**

1. **Confirmar Coleta**
   - Atualiza status para "realizada"
   - Remove da lista de notificações
   - Confirmação via SweetAlert2

2. **Editar Coleta**
   - Navega para página de edição
   - Permite reagendar

## 🔄 Processamento Automático

### **useEffect para Processar Dados**
```javascript
useEffect(() => {
  if (entregas.length > 0) {
    // 1. Converter dados da API em objetos com métodos
    const entregasProcessadas = EntityFactory.createMany('entrega', entregas);
    
    // 2. Filtrar entregas que precisam de atenção
    const entregasVencidas = entregasProcessadas.filter(e => 
      e.status === 'Aguardando Devolução' && e.isVencido()
    );
    const entregasProximasVencimento = entregasProcessadas.filter(e => 
      e.status === 'Aguardando Devolução' && e.isProximoVencimento()
    );
    
    // 3. Combinar em array de notificações
    const todasNotificacoes = [
      ...entregasVencidas.map(e => ({ ...e, tipo: 'vencida' })),
      ...entregasProximasVencimento.map(e => ({ ...e, tipo: 'proxima_vencimento' }))
    ];
    
    setNotificacoes(todasNotificacoes);
  }
}, [entregas]);
```

## 📱 Interface Responsiva

### **Tabela Aprimorada**
- Nova coluna "Data Devolução" com contagem de dias
- Nova coluna "Status" com badges coloridos
- Linhas destacadas para entregas vencidas (fundo vermelho)
- Linhas destacadas para próximas ao vencimento (fundo amarelo)

### **Botões de Ação**
- Botão "Devolvido" (verde) para entregas aguardando devolução
- Botão "Editar" (azul) sempre disponível
- Botão "Excluir" (vermelho) sempre disponível

## 🧪 Como Testar

### **Testar Entregas Vencidas**
1. Crie uma entrega com data de devolução no passado
2. Observe a notificação vermelha no topo
3. Teste os botões "Marcar Devolvido" e "Marcar Vencido"

### **Testar Entregas Próximas ao Vencimento**
1. Crie uma entrega com data de devolução em 1-3 dias
2. Observe a notificação amarela no topo
3. Teste o botão "Marcar Devolvido"

### **Testar Coletas Atrasadas**
1. Crie uma coleta com data/hora no passado
2. Observe a notificação vermelha no topo
3. Teste o botão "Confirmar coleta"

## 🔧 APIs Necessárias

### **Atualização de Status de Entrega**
```javascript
PUT /entregas/{id}
Body: { "status": "Devolvido" | "Vencido" }
```

### **Atualização de Status de Coleta**
```javascript
PUT /coletas/{id}/confirmar
```

## ✅ Status de Implementação

- ✅ **EntregasPage.jsx** - Notificações completas implementadas
- ✅ **PainelColetasPage.jsx** - Atualizado para usar EntityFactory
- ✅ **EntityFactory** - Métodos utilitários funcionando
- ✅ **Interface responsiva** - Cores e badges implementados
- ✅ **Ações do usuário** - Todos os botões funcionais

## 🚀 Benefícios da Implementação

1. **Proatividade**: Sistema alerta automaticamente sobre problemas
2. **Usabilidade**: Ações rápidas diretamente das notificações
3. **Consistência**: Mesmo padrão visual em todo o sistema
4. **Eficiência**: Reduz tempo para identificar e resolver pendências
5. **Rastreabilidade**: Histórico completo de status das entregas

O sistema de notificações está totalmente funcional e integrado com o EntityFactory! 🎉
