# Deploy Lambdas

This GitHub Actions workflow automates the deployment of AWS Lambda functions whenever changes are made to the `lambdas` directory or when triggered manually. It allows for targeted deployments of specific lambdas or all lambdas at once.

## Workflow Overview

- **Triggering Events**:
  - Automatically on `push` events to the `dev` branch that affect files in the `lambdas` directory.
  - Manually via the GitHub Actions interface with the option to specify a lambda name or deploy all lambdas.

## Workflow Structure

The workflow consists of the following jobs:

1. **detect-changes**:
   - Detects which lambda functions have changed since the last commit or based on user input.
   - Outputs a list of changed lambdas.

2. **deploy-lambdas**:
   - Deploys the detected lambdas using a matrix strategy, allowing each lambda to be deployed independently.
   - Runs the necessary setup and build steps for each lambda.

3. **no-changes**:
   - Executes when no changes are detected or if no lambda is specified during a manual trigger.

## Usage

### Automatic Deployment

Whenever changes are pushed to the `dev` branch within the `lambdas` directory, the workflow will automatically detect the changes and deploy the affected lambdas.

### Manual Deployment

To manually trigger the workflow:

1. Navigate to the **Actions** tab in your GitHub repository.
2. Select the **Deploy Lambdas** workflow.
3. Click on the **Run workflow** button.
4. Optionally, provide the name of the lambda you wish to deploy. Use **"all"** to deploy all lambdas or leave the input blank to skip deployment.

### Input Parameters

- **lambda_name**: 
  - Description: The name of the lambda to deploy.
  - Type: `string`
  - Required: `false`
  - Use **"all"** to deploy all lambdas or specify a particular lambda name.

## Workflow Steps

### detect-changes Job

- **Checkout Code**: Uses the `actions/checkout` action to fetch the repository code.
- **Get Changed Files**: Checks for changes in the `lambdas` directory. If triggered manually, it checks the input for specific lambdas or lists all lambdas if "all" is specified.

### deploy-lambdas Job

- **Matrix Strategy**: Deploys each changed lambda independently.
- **Setup Node.js**: Configures the Node.js environment.
- **Pre-deploy Steps**: 
  - Navigates to the specific lambda directory.
  - Installs dependencies, builds the lambda, and prepares it for deployment.
- **Deploy Lambda**: Contains the actual deployment logic (currently a placeholder).

### no-changes Job

- Executes when no changes are detected or no lambda is specified, logging a message that no deployment is needed.

## Notes

- Ensure that your AWS credentials and any necessary secrets are configured in your GitHub repository settings to allow for deployment.
- Modify the deployment logic in the `Deploy lambda` step to include the actual deployment command for your specific setup.

## Conclusion

This workflow provides a flexible and efficient way to manage AWS Lambda deployments directly from your GitHub repository, ensuring that changes are deployed quickly and accurately.