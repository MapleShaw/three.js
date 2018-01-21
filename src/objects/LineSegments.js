import { Line } from './Line.js';
import { Vector3 } from '../math/Vector3.js';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function LineSegments( geometry, material ) {

	Line.call( this, geometry, material );

	this.type = 'LineSegments';

}

LineSegments.prototype = Object.assign( Object.create( Line.prototype ), {

	constructor: LineSegments,

	isLineSegments: true,

	computeLineDistances: ( function () {

		var start = new Vector3();
		var end = new Vector3();

		return function computeLineDistances() {

			var distance = 0;
			var geometry = this.geometry;

			if ( geometry.isBufferGeometry ) {

				// we assume non-indexed geometry

				if ( geometry.index === null ) {

					var positionAttribute = geometry.attributes.position;
					var lineDistances = [];

					for ( var i = 0, l = positionAttribute.count; i < l; i += 2 ) {

						start.fromBufferAttribute( positionAttribute, i );
						end.fromBufferAttribute( positionAttribute, i + 1 );

						distance += start.distanceTo( end );

						lineDistances[ i ] = ( i === 0 ) ? 0 : lineDistances[ i - 1 ];
						lineDistances[ i + 1 ] = distance;

					}

					geometry.addAttribute( 'lineDistance', new THREE.Float32BufferAttribute( lineDistances, 1 ) );

				} else {

					console.warn( 'THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.' );

				}

			} else if ( geometry.isGeometry ) {

				var vertices = geometry.vertices;

				for ( var i = 0, l = vertices.length; i < l; i += 2 ) {

					start.copy( vertices[ i ] );
					end.copy( vertices[ i + 1 ] );

					distance += start.distanceTo( end );

					geometry.lineDistances[ i ] = ( i === 0 ) ? 0 : geometry.lineDistances[ i - 1 ];
					geometry.lineDistances[ i + 1 ] = distance;

				}

			}

			return this;

		};

	}() )

} );


export { LineSegments };
