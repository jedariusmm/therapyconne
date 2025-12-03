const handler = (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    service: 'TherapyConnect API',
    timestamp: new Date().toISOString()
  });
};

module.exports = handler;
