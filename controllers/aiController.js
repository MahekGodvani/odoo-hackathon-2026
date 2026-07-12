const { Asset, User, RepairRequest, MaintenanceRecord } = require('../models');

const handleAIChat = async (req, res) => {
  try {
    const { message } = req.body;
    const msgLower = (message || '').toLowerCase();
    
    let reply = "Hello! I am your AssetFlow AI Assistant. How can I help you manage your enterprise assets today? You can ask me: 'How many assets do we have?', 'What is the system health status?', or 'Are there any pending repair tickets?'";
    
    if (msgLower.includes('asset') && (msgLower.includes('how many') || msgLower.includes('count') || msgLower.includes('total'))) {
      const count = await Asset.count();
      reply = `There are currently **${count}** total assets registered in the database.`;
    } else if (msgLower.includes('repair') || msgLower.includes('broken') || msgLower.includes('service')) {
      const count = await RepairRequest.count({ where: { status: 'Pending' } });
      reply = `There are currently **${count}** pending repair tickets awaiting technician review.`;
    } else if (msgLower.includes('maintenance') || msgLower.includes('schedule')) {
      const count = await MaintenanceRecord.count();
      reply = `We have recorded **${count}** historical maintenance logs. Let me know if you would like me to compile a cost summary.`;
    } else if (msgLower.includes('health') || msgLower.includes('status')) {
      const total = await Asset.count();
      const available = await Asset.count({ where: { status: 'Available' } });
      const pct = total ? Math.round((available / total) * 100) : 100;
      reply = `System health status is excellent: **${pct}%** of our total asset fleet is currently marked "Available" and ready for assignment.`;
    } else if (msgLower.includes('hi') || msgLower.includes('hello')) {
      reply = "Hello! How can I assist you with your assets registry today?";
    }
    
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('AI chat processing failed:', error);
    return res.status(500).json({ message: 'AI processing failed' });
  }
};

module.exports = {
  handleAIChat
};
