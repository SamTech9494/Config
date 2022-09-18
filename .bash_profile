alias zso="source ~/.bash_profile"
alias ze="vim ~/.bash_profile"


# variables
GITPROJECTPATH="/d/Work/MATW/"
TFSPROJECTPATH="/d/workspace/TFS/"
GITPROJECTS="${GITPROJECTPATH}*/"
# quick access
alias cdd="cd /d"
alias cdc="cd /c"
alias matw="cd /d/work/MATW"
alias cdgit="cd ${GITPROJECTPATH}"

for dir in ${GITPROJECTS[@]}; do
	project_name=${dir/${GITPROJECTPATH}/};
	project_name=${project_name/\/};
	alias ${project_name}="cd $dir"
done

alias kc-gke-stg="export KUBECONFIG=$HOME/.kube/gke-stg/config" 
alias kc-gke-uat="export KUBECONFIG=$HOME/.kube/gke-uat/config" 
alias kc-gke-prod="export KUBECONFIG=$HOME/.kube/gke-prod/config" 

alias k="kubectl"

function npush() {
    if [[ $1 == "" ]]; then
        echo "input package"
    else
        nuget push $1 -source http://nuget.coreop.net/nuget 1234567a
    fi
}
