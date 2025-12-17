#packages routes
def include_packages_routes(config):
    config.add_route("packages", "/api/packages")
    config.add_route("package_detail", "/api/packages/{id}")
    config.add_route("package_agent", "/api/packages/agent/{agentId}")
