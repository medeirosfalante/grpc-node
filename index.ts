var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
export  class Grpc {
    ref :any
    server :any

    constructor(file,packageRef){
        // Suggested options for similarity to existing grpc.load behavior
        var packageDefinition = protoLoader.loadSync(
            file,
            {keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
            });
        var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
        this.ref =  protoDescriptor[packageRef];
        
    }

    GetServiceClient(serviceURI,serviceName){
        return new this.ref[serviceName](serviceURI,grpc.credentials.createInsecure());
    }

    ConfigServer() {
        this.server = new grpc.Server();
    }
    AddProto(serviceName,schema){
        this.server.addService(this.ref[serviceName].service,schema);
    }

    StartService(serviceURI) {
        this.server.bind(serviceURI, grpc.ServerCredentials.createInsecure());
        this.server.start();
    }


}
  