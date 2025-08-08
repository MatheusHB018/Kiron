class NotificationService {
    constructor() {
        if (NotificationService.instance) {
            return NotificationService.instance;
        }
        this.notifications = []; // Simula uma fila de notificações
        NotificationService.instance = this;
    }

    // Método para obter a instância única (ponto de acesso global)
    static getInstance() {
        if (!this.instance) {
            this.instance = new NotificationService();
        }
        return this.instance;
    }

    // Adiciona uma nova notificação à fila
    addNotification(type, message, details) {
        const notification = {
            id: Date.now(), // ID simples baseado no tempo
            type,           // Ex: 'ALERTA_COLETA', 'AVISO_DEVOLUCAO'
            message,        // Mensagem principal
            details,        // Objeto com dados extras (ex: id_paciente)
            read: false,
            createdAt: new Date()
        };
        this.notifications.push(notification);
        console.log(`[Notificação Adicionada]: ${message}`, details);
        // Aqui, no futuro, você poderia adicionar a lógica para enviar um email, SMS ou push notification
    }

    // Retorna todas as notificações não lidas
    getUnreadNotifications() {
        return this.notifications.filter(n => !n.read);
    }

    // Marca uma notificação como lida
    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            console.log(`[Notificação Lida]: ${notification.message}`);
        }
    }
}

// Congela o objeto para garantir que a instância não possa ser alterada
const instance = new NotificationService();
Object.freeze(instance);

module.exports = instance; // Exporta a instância única