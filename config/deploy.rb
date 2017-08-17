require 'open-uri'
require 'ostruct'
require 'json'

lock '3.4.0'


set :deploy_to, "/data/apps/#{fetch(:application)}"
set :user,        "blurbapp"
set :scm,         :artifact
set :format, :pretty
set :log_level, :debug
set :pty, true
set :use_sudo, false
set :keep_releases, 5
namespace_name = fetch(:application).gsub('-', '_')
set :linked_dirs, fetch(:linked_dirs, [])


set :app_roles, :website #for default deploy tasks

Rake::Task["deploy"].clear_actions
task :deploy do
  fail("Don't call the default action. Call #{namespace_name}:deploy")
end

namespace namespace_name do

  task :deploy do
    begin
      invoke "deploy:starting"
      invoke "deploy:updating"
      invoke 'assets:download'
      invoke 'deploy:publishing'
      invoke "deploy:finishing"
      invoke "deploy:finished"
      invoke 'configuration:update_and_reload'
    rescue StandardError => err
      puts("Failed deploy: #{err}")
      puts("Performing failed deploy rollback")
      invoke "deploy:rollback"
      raise
    end
  end
end

namespace :assets do
  task :download do
    asset_name = fetch(:artifact_name)
    on roles(:website) do
      info("Artifact url: #{fetch(:artifact_job_url)}")
      execute "wget -q #{fetch(:artifact_job_url)} -O #{release_path}/#{asset_name}"
      execute "cd #{release_path}; tar -xzf #{asset_name}; rm #{asset_name}"
    end
  end
end

namespace :configuration do
  task :update_and_reload do
    app_name = fetch(:application)
    nginx_config = <<-CONFIG
location ~* ^/#{app_name}(/(?<dashpath>.+))? {
  root /data/apps/bookify-react/current;
  try_files /$dashpath /index.html =404;
}
    CONFIG

    on roles(:website) do |host|      
      upload! StringIO.new(nginx_config), "/data/conf/nginx/#{app_name}.conf", :mode => 0660
      execute "sudo /etc/init.d/nginx reload"
    end
  end
end


before "#{namespace_name}:deploy", "artifact_var_prep" do
  #TODO: This is the generic version. Hardcode the artifact name for now
  #artifact_job_name = fetch(:application).split(/[-_]/).map{|w| w.capitalize}.join('-')
  artifact_job_name = "Bookify-React"

  set :jenkins_host, "jenkins.blurb.com"
  set :artifact_job, fetch_param(:artifact_job,  "#{artifact_job_name}-#{fetch(:branch).capitalize}")
  artifact_number = fetch_param(:artifact_number, "lastSuccessfulBuild")
  if artifact_number == 'lastSuccessfulBuild'
    build_id_url = "http://#{fetch(:jenkins_host)}/job/#{fetch(:artifact_job)}/lastSuccessfulBuild/api/xml?xpath=//freeStyleBuild/number/text()"
    output = `curl -sS  "#{build_id_url}"`
    fail("Could not determine build id for lastSuccessfulBuild (#{build_id_url}): #{output}") unless output =~ /^\d+$/
    artifact_number = output
    puts("Detected build id #{artifact_number} for lastSuccessfulBuild")
  else
    puts("Using command line artifact number: #{artifact_number}")
  end

  set :artifact_name, fetch_param(:artifact_name, "#{artifact_job_name.downcase}.tar.gz")
  set :jenkins_job_url, "http://#{fetch(:jenkins_host)}/job/#{fetch(:artifact_job)}/#{artifact_number}"
  set :artifact_job_url, fetch_param(:artifact_job_url, "#{fetch(:jenkins_job_url)}/artifact/#{fetch(:artifact_name)}")
end
