const execSync = require('child_process').execSync
const inquirer = require('inquirer')
const { apps, stages, namespaces } = require('./values')
const fs = require('fs')
const path = require('path')
const changeCase = require('change-case')

const questions = [
  {type: 'list', name: 'app', message: 'application name', choices: apps},
  {type: 'list', name: 'stage', message: 'select the enviroment', choices: stages},
  {name: 'secretKey', message: 'secret key'},
  {name: 'secretValue', message: 'secret value'}
]

const encrypt = function () {
  inquirer
    .prompt(questions)
    .then((answers) => {

      const namespace = namespaces[`${answers.app}`]

      const name = changeCase.paramCase(answers.app)

      const sealCertPath = path.join(__dirname, `/seal_secrets_${answers.stage}.pem`)

      const output = execSync(
        `kubectl create secret generic ${name} --namespace ${namespace} --from-literal=${answers.secretKey}=${answers.secretValue} --dry-run -o yaml | kubeseal --cert ${sealCertPath} --format json`);

      const jsonOutput = JSON.parse(output)

      const sealedSecretsPath = path.join(__dirname, `..apps/${answers.app}/${answers.stage}/sealedSecrets.json`)

      if (!fs.existsSync(sealedSecretsPath)) {
        const jsonSealedSecrets = JSON.stringify(jsonOutput, null, 2)
        fs.writeFileSync(sealedSecretsPath, jsonSealedSecrets)
      } else {
        const sealedSecrets = JSON.parse(fs.readFileSync(sealedSecretsPath))

        sealedSecrets.spec.encryptedData[`${answers.secretKey}`] = jsonOutput.spec.encryptedData[answers.secretKey]
        const jsonSealedSecrets = JSON.stringify(sealedSecrets, null, 2)

        fs.writeFileSync(sealedSecretsPath, jsonSealedSecrets)
      }
    })
}

module.exports = encrypt