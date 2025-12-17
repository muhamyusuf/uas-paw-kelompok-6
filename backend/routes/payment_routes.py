#payment routes
def include_payments_routes(config):
    config.add_route("payment_generate", "/api/payment/generate")
