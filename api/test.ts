import authenticateAndCatch from '../lib/authenticateAndCatch'

export default authenticateAndCatch(__filename, (req, res) => {
  console.log({ body: req.body, headers: req.headers })
  res.status(200).json(req.body)
})
