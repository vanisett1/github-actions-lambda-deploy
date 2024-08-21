# github-actions

# name: Deploy Lambdas

# on:
#   push:
#     branches:
#       - dev
#     paths:
#       - 'lambdas/**'  # Trigger on changes in the lambdas directory

# jobs:
#   deploy:
#     runs-on: ubuntu-latest
#     steps:
#     - name: Checkout code with history
#       uses: actions/checkout@v2
#       with:
#         fetch-depth: 2  # Ensure we have enough history to compare changes

#     - name: Identify modified Lambda directories
#       id: find_lambdas
#       run: |
#         # Find the list of modified directories inside lambdas/
#         modified_lambdas=$(git diff --name-only HEAD~1 HEAD | grep '^lambdas/' | cut -d'/' -f 2 | sort -u)
        
#         if [ -z "$modified_lambdas" ]; then
#           echo "No Lambda functions were modified."
#           exit 0
#         fi

#         echo "Modified Lambda functions: $modified_lambdas"
#         echo "::set-output name=modified_lambdas::$modified_lambdas"

#     - name: Deploy modified Lambdas
#       run: |
#         for lambda in ${{ steps.find_lambdas.outputs.modified_lambdas }}; do
#           echo "Deploying Lambda: $lambda"
#           cd lambdas/$lambda

#           npm install
#           npm version $(jq -r '.version' package.json)-${{ github.run_number }}
#           npm run build
#           cp viax.${GITHUB_REF_NAME}.yaml viax.yaml
#           npm run test
#           rm -f fcn.zip
#           npm install --production
#           zip -y -r fn.zip . 

#           # Deploy to Viax
#           TOKEN=$(curl -X POST -d "grant_type=password&client_id=$CLIENT_ID&username=${{ secrets.VIAX_USERNAME }}&password=${{ secrets.VIAX_PASSWORD }}" ${{ secrets.AUTH_URL }} | jq -r '.access_token')
#           response=$(curl --request POST \
#             --url "${{ secrets.API_URL }}" \
#             --header "Authorization: Bearer $TOKEN" \
#             --header 'Content-Type: multipart/form-data' \
#             --form 'operations={ 
#               "operationName": "upsertFunction",
#               "query": "mutation upsertFunction($file: Upload!) { upsertFunction(input: { fun: $file }) { uid } }",
#               "variables": { "file": null }
#             }' \
#             --form 'map={ "File":["variables.file"] }' \
#             --form File=@./fcn.zip)

#           if [[ $response == *"uid"* ]]; then
#             echo "Successfully deployed Lambda function $lambda."
#           else
#             echo "Failed to deploy Lambda function $lambda."
#             exit 1
#           fi
#         done
