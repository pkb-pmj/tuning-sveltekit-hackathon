export class AppHistory<T> {
	private timeline: T[];
	private cursor: number;

	constructor(initialValue: T) {
		this.timeline = [initialValue];
		this.cursor = 0;
	}

	current(): T {
		return this.timeline[this.cursor];
	}

	push(value: T) {
		if (this.cursor < this.timeline.length - 1) {
			this.timeline.splice(this.cursor + 1);
		}
		this.timeline.push(value);
		this.cursor++;
	}

	forward(): T {
		if (this.cursor < this.timeline.length - 1) {
			this.cursor++;
		}
		return this.current();
	}

	backward(): T {
		if (this.cursor > 0) {
			this.cursor--;
		}
		return this.current();
	}
}
