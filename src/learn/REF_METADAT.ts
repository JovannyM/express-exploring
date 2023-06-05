/* eslint-disable */
import 'reflect-metadata';

function RefM(target: Function) {
	Reflect.defineMetadata('a', 1, target);
	const meta = Reflect.getMetadata('a', target);
	console.log(meta);
}

function Prop(target: Object, name: string) {}

@RefM
export class SomeClass {
	@Prop prop!: number;
}
