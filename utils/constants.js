const UserRegisterType = new Set(['admin', 'employee'])
const AllowedFileTypes = new Set(['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'])
const maxFileSize = 50 * 1024 * 1024
const Roles = {
    ADMIN: 'admin'
}
const SalesStatus = {
    Pending: 'pending',
    Approved: 'approved',
    Shipped: 'shipped',
    Delivered: 'delivered',
}
const Distractions = {
    Online: 'online',
    Offline: 'offline'
}
module.exports = { AllowedFileTypes, Roles, UserRegisterType, maxFileSize, SalesStatus, Distractions }