
# Configuração de Credenciais para o Workflow n8n

## 1. Credenciais do Feegow API

1. No n8n, vá em **Settings > Credentials**
2. Clique em **Create Credential**
3. Escolha **HTTP Header Auth**
4. Configure:
   - **Name**: `Feegow API`
   - **Header Name**: `x-access-token`
   - **Header Value**: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmZWVnb3ciLCJhdWQiOiJwdWJsaWNhcGkiLCJpYXQiOjE3NDQxNTUwNTYsImxpY2Vuc2VJRCI6NDQyMzF9.AYoQZFc1vE7Pv0TX5r82uAAjjGFlFcXTGWe3ph-4TB0`

## 2. Credenciais do WhatsApp API

1. No n8n, vá em **Settings > Credentials**
2. Clique em **Create Credential**
3. Escolha **HTTP Header Auth**
4. Configure:
   - **Name**: `WhatsApp API`
   - **Header Name**: `Authorization`
   - **Header Value**: `Bearer EAANuj2s91QEBO3uTgLxMZAgMVF5IvZCXqeZCvexb4zU3GZBqxD8ZCTjDI2W7MT3lGnxa9sLlAZCUdO6CYmHtuCvonzf7j9kykYo66jBX1qZCGp5gqfNsgQdUNPPw5IEhMPYzbaTaImQyeC16SfERvbMGiNNPX1009MW4NhYob7JDiWrcJ9WQerZCnC96woZBqy8gl1QZDZD`

## 3. Configuração Adicional do WhatsApp

No nó "Enviar WhatsApp", você precisará configurar o `phone_number_id`:
- Substitua `{{$credentials.whatsapp.phone_number_id}}` por `512788381916390`

Ou crie uma credencial personalizada para o WhatsApp:
1. Escolha **Generic Credential**
2. Configure:
   - **Name**: `WhatsApp Config`
   - **phone_number_id**: `512788381916390`
   - **token**: `EAANuj2s91QEBO3uTgLxMZAgMVF5IvZCXqeZCvexb4zU3GZBqxD8ZCTjDI2W7MT3lGnxa9sLlAZCUdO6CYmHtuCvonzf7j9kykYo66jBX1qZCGp5gqfNsgQdUNPPw5IEhMPYzbaTaImQyeC16SfERvbMGiNNPX1009MW4NhYob7JDiWrcJ9WQerZCnC96woZBqy8gl1QZDZD`

## 4. Como Usar o Workflow

### Exemplo de Payload para o Webhook:

```json
{
  "telefone": "5585999999999",
  "nome": "João Silva",
  "especialidade_id": 123,
  "profissional_id": 456,
  "convenio_id": 789,
  "data_agendamento": "2024-12-30",
  "horario": "14:00",
  "paciente_id": 999
}
```

### URL do Webhook:
Após importar o workflow, a URL será:
`https://seu-n8n.com/webhook/webhook-agendamento`

## 5. Fluxo do Workflow

1. **Webhook Trigger**: Recebe os dados do agendamento
2. **Validar Dados**: Valida e formata os dados recebidos
3. **Buscar APIs**: Consulta especialidades, profissionais e horários em paralelo
4. **Processar Dados**: Combina as respostas e valida disponibilidade
5. **Criar Agendamento**: Cria o agendamento no Feegow
6. **Preparar WhatsApp**: Formata os dados para o template do WhatsApp
7. **Enviar WhatsApp**: Envia a mensagem de confirmação
8. **Resposta Final**: Retorna o resultado da operação

## 6. Tratamento de Erros

O workflow inclui tratamento de erros que captura falhas em qualquer etapa e retorna uma resposta estruturada com informações sobre o erro.

## 7. Template do WhatsApp

O workflow usa o template "lagendamento" com os seguintes parâmetros:
1. Nome do paciente
2. Especialidade
3. Data (DD-MM-YYYY)
4. Horário (HH:MM)
5. Local (Longevin)
6. Profissional
7. Convênio
