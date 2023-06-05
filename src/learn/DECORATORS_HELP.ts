function Component(id: number) {
	console.log('init');
	return (target: Function) => {
		target.prototype.id = id;
		console.log('run ' + target.prototype.id);
	};
}

function Method(target: Object, propertyKey: string, propertyDescriptor: PropertyDescriptor) {
	console.log('Method works');
	console.log(propertyKey);
	propertyDescriptor.value = function (...args: unknown[]) {
		if (typeof args[0] === 'number') {
			return args[0] * 10;
		}
	};
}

function Filed(target: Object, propertyKey: string) {
	let value: number;

	const getter = () => {
		console.log('Getting');
		return value;
	};

	const setter = (newValue: number) => {
		console.log('Settings');
		value = newValue;
	};

	Object.defineProperty(target, propertyKey, {
		get: getter,
		set: setter,
	});
}

function Param(target: Object, propertyKey: string, index: number) {
	console.log(propertyKey, index);
}

@Component(1)
export class USER {
	@Filed public id!: number;

	@Method
	updateId(@Param newId: number) {
		this.id = newId;
		return this.id;
	}
}

const user = new USER();

console.log(user.id);
console.log(user.updateId(10));
